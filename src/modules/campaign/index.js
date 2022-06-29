import React, { useEffect, useState } from 'react';
import {Button, Card, CardBody, CardTitle, CustomInput, Table} from "reactstrap";
import {dottedString} from "../../utils";
import moment from "moment";
import {Link} from "react-router-dom";
import axios from "axios";
import API from "../../constants/api";
import {getUserToken} from "../../utils/sessionManager";
import {APP_CONSTANTS} from "../../constants";


const CampaignList = ({match}) =>{

    const [currentPage, setCurrentPage] = useState(1);
    const { userId } = match.params;
    const access_token = getUserToken();
    const { PAGE_LIMIT } = APP_CONSTANTS;
    const [campaginsList, setCampaignsList] = useState(null);

    const [totalRecords, setTotalRecords] = useState(null);

    const fetchCampaignsList =( ) =>{
       axios.get(`${API.USERS}/token?email=${agencyUserEmail}`,{
            headers: {access_token: access_token}
        }).then(tokenResponse => {
            const campaignListUrl = API.FUNDRAISER_CAMPAIGN
            axios.get(campaignListUrl, {
                headers: {Authorisation: `Bearer ${tokenResponse.data}`}
            }).then(camapaignsList =>{
                console.log(camapaignsList.data.data);
                setCampaignsList(camapaignsList.data.data);
                setTotalRecords(camapaignsList.data.data.length);
            })
        });
    }
    const onPageChanged = () =>{
        console.log("Page changed");
    }
    // const onPageChanged = useCallback(
    //     async paginationData => {
    //         const params = {};
    //         // if (searchName) params.name = searchName;
    //         // if (projectStatus) params.status = projectStatus;
    //         // const { currentPage, pageLimit } = paginationData;
    //         // setCurrentPage(currentPage);
    //         // let start = (currentPage - 1) * pageLimit;
    //         // const query = { start, limit: PAGE_LIMIT, ...params };
    //         // const { data } = await listAid(query);
    //         // setProjectList(data);
    //         // fetchProjectsBalances(data);
    //     }
    //     // []listAid, projectStatus, searchName, fetchProjectsBalances
    //     ,[campaginsList]
    // );

    function fetchAgencyDetails() {
        return new Promise((resolve, reject) => {
            const agencyDetailsUrl = API.APP+"/settings";
            const agencyDetailsResponse = axios.get(agencyDetailsUrl).then(res => {
                if (res.statusText === 'OK') {
                    resolve(res.data);
                }
                reject(res.data);
            })
                .catch(err => {
                    reject(err);
                });
            return agencyDetailsResponse;
        })
    }

    const [agencyUserEmail, setAgencyUserEmail] = useState(null);
    const fetchAgencyUserDetails =() => {
        try{
            fetchAgencyDetails().then(agencyDetails => {
                console.log('The AgencyDetails are:: ', agencyDetails);
                setAgencyUserEmail(agencyDetails.agency.email);
            });
        }catch(error){
            console.log("Exception while fetchAgencyUserDetails, ",error);
        }
    };
    const handleCampaignStatusChanged = e => {
        const query = {};
        const { value } = e.target;
        if (value) query.status = value;
        setCampaignsList(campaginsList.sort((a, b) => a.status == value));
    };

    useEffect(()=>{
        fetchAgencyUserDetails();
        fetchCampaignsList();
    },[])
return (
    <>
        <Card>
            <CardTitle className="mb-0 pt-3">
                <span style={{ paddingLeft: 26 }}>Published Campaigns</span>
            </CardTitle>
            <CardBody>
                <Table className="no-wrap v-middle" responsive>
                    <thead>
                    <tr className="border-0">
                        <th className="border-0">S.N.</th>
                        <th className="border-0">Title</th>
                        <th className="border-0">Target</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Campaign End Date</th>
                        <th className="border-0">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {campaginsList && campaginsList.length ? (
                        campaginsList.map((d, i) => {
                            return (
                                <tr key={d.id}>
                                    <td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
                                    <td>{dottedString(d.title)}</td>
                                    <td>{dottedString(d.target)} BNB</td>
                                    <td>{dottedString(d.amount)} {d.amount ? 'BNB':''}</td>
                                    <td>{dottedString(d.status.toUpperCase())}</td>
                                    <td>{moment(d.expiryDate).format('MMM Do YYYY')}</td>
                                    <td className="blue-grey-text  text-darken-4 font-medium">
                                        <Link  to={{ pathname: `${API.FUNDRAISER_FUNDRAISE}/${d.id}` }} target="_blank">
                                            <i className="fas fa-eye fa-lg"></i>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={2}></td>
                            <td>No data available.</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            {/*    {totalRecords > 0 && (*/}
            {/*    <AdvancePagination*/}
            {/*        totalRecords={totalRecords}*/}
            {/*        pageLimit={PAGE_LIMIT}*/}
            {/*        pageNeighbours={1}*/}
            {/*        onPageChanged={onPageChanged}*/}
            {/*    />*/}
            {/*)}*/}

            </CardBody>
        </Card>

    </>
)
}

export default CampaignList;
