import React, { useState, useEffect, useCallback } from 'react';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';
const FIRST_PAGE = 1;
const TOTAL_PAGES_IN_NUMBER = 5;

const range = (from, to, step = 1) => {
	let i = from;
	const range = [];

	while (i <= to) {
		range.push(i);
		i += step;
	}

	return range;
};

export default function AdvancePaginate(props) {
	const [currentPage, setCurrentPage] = useState(null);
	const { totalRecords = 0, pageLimit = 2, pageNeighbours = 0, onPageChanged } = props;

	const totalPages = Math.ceil(totalRecords / pageLimit);
	//   const { onPageChanged = (f) => f } = props;

	const handlePageChange = useCallback(
		paginationData => {
			onPageChanged(paginationData);
		},
		[onPageChanged]
	);

	const gotoPage = useCallback(
		page => {
			const currentPage = Math.max(0, Math.min(page, totalPages));

			const paginationData = {
				currentPage,
				totalPages: totalPages,
				pageLimit: pageLimit,
				totalRecords: totalRecords
			};

			setCurrentPage(currentPage);
			handlePageChange(paginationData);
		},
		[handlePageChange, pageLimit, totalPages, totalRecords]
	);

	const handleClick = (page, evt) => {
		evt.preventDefault();
		gotoPage(page);
	};

	const handleMoveLeft = evt => {
		evt.preventDefault();
		gotoPage(currentPage - pageNeighbours * 2 - 1);
	};

	const handleMoveRight = evt => {
		evt.preventDefault();
		gotoPage(currentPage + pageNeighbours * 2 + 1);
	};

	const fetchPageNumbers = () => {
		// const totalNumbers = pageNeighbours * 2 + 3; // Total page numbers to display
		const totalNumbers = TOTAL_PAGES_IN_NUMBER; // Total page numbers to display

		const totalBlocks = totalNumbers + 2; // Total page blocks to display i.e. 7 for now

		if (totalPages > totalBlocks) {
			let pages = [];

			const leftBound = currentPage - pageNeighbours; // Page before current page
			const rightBound = currentPage + pageNeighbours; // Page after current page
			const beforeLastPage = totalPages - 1;

			// For range calculation
			const startPage = leftBound > 2 ? leftBound : 2;
			const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

			pages = range(startPage, endPage); // Prev,Current and Next pages || [2] => Currenpage=1 || [2,3] => Currentpage = 2

			const pagesCount = pages.length;
			const singleSpillOffset = totalNumbers - pagesCount - 1;

			const leftSpill = startPage > 2;
			const rightSpill = endPage < beforeLastPage;

			const leftSpillPage = LEFT_PAGE;
			const rightSpillPage = RIGHT_PAGE;

			if (leftSpill && !rightSpill) {
				const extraPages = range(startPage - singleSpillOffset, startPage - 1);
				pages = [leftSpillPage, ...extraPages, ...pages];
			} else if (!leftSpill && rightSpill) {
				const extraPages = range(endPage + 1, endPage + singleSpillOffset);
				pages = [...pages, ...extraPages, rightSpillPage];
			} else if (leftSpill && rightSpill) {
				pages = [leftSpillPage, ...pages, rightSpillPage];
			}

			return [FIRST_PAGE, ...pages, totalPages];
		}

		return range(FIRST_PAGE, totalPages);
	};

	useEffect(() => {
		gotoPage(FIRST_PAGE);
	}, [gotoPage]);

	const pages = fetchPageNumbers();

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				marginTop: '40px'
			}}
		>
			<nav aria-label="Pagination">
				<ul className="pagination">
					{pages.map((page, index) => {
						if (page === LEFT_PAGE)
							return (
								<li key={index} className="page-item">
									<a className="page-link" href="#prev" aria-label="Previous" onClick={handleMoveLeft}>
										<span aria-hidden="true">&laquo;</span>
										<span className="sr-only">Previous</span>
									</a>
								</li>
							);

						if (page === RIGHT_PAGE)
							return (
								<li key={index} className="page-item">
									<a className="page-link" href="#next" aria-label="Next" onClick={handleMoveRight}>
										<span aria-hidden="true">&raquo;</span>
										<span className="sr-only">Next</span>
									</a>
								</li>
							);

						return (
							<li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
								<a className="page-link" href="#move" onClick={e => handleClick(page, e)}>
									{page}
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
