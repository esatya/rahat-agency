import DataService from '../../../src/services/db';
import 'fake-indexeddb/auto';
import 'regenerator-runtime/runtime';
import { NETWORKS, getNetworkByName } from '../../../src/constants/networks';
describe('Testing Index DB', () => {
	//Data Table
	describe('Tests major function in indx db data table', () => {
		it('gets network by name', async () => {
			const fetchNetwork = getNetworkByName('mainnet');

			expect(fetchNetwork).toMatchObject(NETWORKS.find(network => network.name === 'mainnet'));
		});
		it('Saves and gets data correctly', async () => {
			const name = 'Test Data';
			const data = {
				0: 'abx',
				1: 'qwery'
			};
			await DataService.save(name, data);
			const savedData = await DataService.get(name);

			expect(savedData).toMatchObject(data);
		});
		it('gets init app', async () => {
			const data = {
				network: {
					name: 'rumsan_test',
					url: 'http://195.179.200.228:8548',
					display: 'Rumsan Test Network',
					default: true
				},
				address: null,
				wallet: null
			};
			const initApp = await DataService.initAppData();
			expect(initApp).toMatchObject({ ...data });
		});
		it('gets removes data properly', async () => {
			const mockData = {
				name: 'testData',
				data: 'Hello world'
			};
			await DataService.save(mockData.name, mockData.data);

			const saveData = await DataService.get(mockData.name);
			expect(saveData).toBe(mockData.data);

			await DataService.remove(mockData.name);

			const removedData = await DataService.get(mockData.name);

			expect(removedData).toBeNull();
		});

		it('lists data table properly', async () => {
			const mockData = {
				name: 'Test Data',
				data: {
					0: 'abx',
					1: 'qwery'
				}
			};
			const list = await DataService.list();
			expect(list).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: mockData.name
					})
				])
			);
		});

		it('saves and gets network properly', async () => {
			// await DataService.clearAll();
			const network = NETWORKS.filter(netwrk => netwrk.name === 'rumsan');
			await DataService.saveNetwork(network);

			const savedNetwork = await DataService.getNetwork();
			expect(savedNetwork).toMatchObject(network);
		});
		it('saves and gets ipfsUrl properly', async () => {
			const mockUrl = process.env.REACT_APP_DEFAULT_IPFS;
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			await DataService.saveIpfsUrl(mockUrl);

			const saveUrl = await DataService.getIpfs();
			expect(saveUrl).toMatchObject({ ipfsUrl: mockUrl, ipfsDownloadUrl: mockDownloadUrl });
		});

		it('saves and gets ipfsUrl incorrectly', async () => {
			const mockUrl = 'http://ipfsUrl.com';
			const mockDownloadUrl = 'http://ipfsDownload.com';
			await DataService.saveIpfsUrl(mockUrl);
			await DataService.saveIpfsDownloadUrl(mockDownloadUrl);

			const saveUrl = await DataService.getIpfs();
			expect(saveUrl).toMatchObject({
				ipfsUrl: process.env.REACT_APP_DEFAULT_IPFS,
				ipfsDownloadUrl: process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD
			});
		});

		it('saves and gets ipfsDownloadUrl properly', async () => {
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			await DataService.saveIpfsDownloadUrl(mockDownloadUrl);

			const savedUrl = await DataService.get('ipfsUrlDownload');
			expect(savedUrl).toEqual(mockDownloadUrl);
		});

		it('saves private key', async () => {
			const mockPrivateKey = process.env.REACT_APP_PRIVATE_KEY;
			await DataService.savePrivateKey(mockPrivateKey);

			const SavePrivateKey = await DataService.get('privateKey');
			expect(SavePrivateKey).toEqual(mockPrivateKey);
		});

		it('saves and gets address properly', async () => {
			const mockAddress = 'banepa123';
			await DataService.saveAddress(mockAddress);

			const savedAddress = await DataService.getAddress();
			expect(savedAddress).toEqual(mockAddress);

			const locallySavedAddress = DataService.getAddressFromLocal();
			expect(locallySavedAddress).toEqual(mockAddress);
		});

		it('saves wallet properly', async () => {
			const mockWallet = {
				address: '0xeddA7538FB64f60589605AFeFC90c510d2cAfA18',
				network: 'https://testnetwork.esatya.io'
			};

			await DataService.saveWallet(mockWallet);

			const savedWallet = await DataService.getWallet();
			expect(savedWallet).toMatchObject(mockWallet);
		});
	});

	//Assets

	describe('Tests major functions of index db in assests table', () => {
		const mockAsset = {
			address: 'default',
			balance: 0,
			decimal: 18,
			name: 'Ether',
			symbol: 'ETH'
		};
		const secondaryAsset = {
			address: 'secondary',
			balance: 0,
			decimal: 18,
			name: 'Asset1',
			symbol: 'AST'
		};
		const assetWithNetwork = {
			address: 'third',
			balance: 0,
			decimal: 18,
			name: 'AssetBit',
			symbol: 'ASTB',
			network: NETWORKS[0]
		};
		it('adds and gets default assets properly', async () => {
			await DataService.addDefaultAsset(mockAsset.symbol, mockAsset.name);
			const savedAsset = await DataService.getAsset(mockAsset.address);

			expect(savedAsset).toMatchObject(mockAsset);
		});
		it('adds and gets default assets incorrectly', async () => {
			await DataService.addDefaultAsset(mockAsset.symbol, mockAsset.name);
			await DataService.getAsset('');
			expect(mockAsset).toMatchObject({ address: 'default', symbol: 'ETH', name: 'Ether', decimal: 18, balance: 0 });
		});
		it(' gets assets by symbol properly', async () => {
			const savedAsset = await DataService.getAssetBySymbol(mockAsset.symbol);

			expect(savedAsset).toMatchObject(mockAsset);

			await DataService.saveAsset(assetWithNetwork);
			const savedAssetWithNetwork = await DataService.getAssetBySymbol(assetWithNetwork.symbol, NETWORKS[0].name);

			expect(savedAssetWithNetwork).toMatchObject(assetWithNetwork);
		});
		it(' saves multiple assets  properly and lists all of them properly', async () => {
			await DataService.clearAll();
			await DataService.addMultiAssets([mockAsset, secondaryAsset, assetWithNetwork]);
			const assetsList = await DataService.listAssets();
			expect(assetsList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: mockAsset.name
					})
				])
			);
			expect(assetsList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: secondaryAsset.name
					})
				])
			);
			const assetsListWIthNetwork = await DataService.listAssets(NETWORKS[0].name);
			expect(assetsListWIthNetwork).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: assetWithNetwork.name
					})
				])
			);
		});

		it('updates assets properly', async () => {
			const update = { name: 'updatedAsset' };
			await DataService.updateAsset(secondaryAsset.address, {
				...secondaryAsset,
				name: update.name
			});

			const updatedAsset = await DataService.getAsset(secondaryAsset.address);
			expect(updatedAsset).toMatchObject({ ...secondaryAsset, name: update.name });
		});
	});

	//Document

	describe('Tests major functions of index db in document table', () => {
		const mockDocument = {
			hash: 'hash1',
			type: 'type',
			name: 'name',
			file: 'file',
			encryptedFile: 'encryptedFile',
			createdAt: 'createdAt',
			inIpfs: 'inIpfs'
		};
		const secondMockDocument = {
			hash: 'hash2',
			type: 'type',
			name: 'name',
			file: 'file',
			encryptedFile: 'encryptedFile',
			createdAt: 'createdAt',
			inIpfs: 'inIpfs'
		};

		it('saves and gets document properly', async () => {
			await DataService.saveDocuments(mockDocument);

			let document = await DataService.getDocument(mockDocument.hash);

			expect(document).toMatchObject(mockDocument);
			let documentList;

			documentList = await DataService.listDocuments();
			expect(documentList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						hash: mockDocument.hash
					})
				])
			);

			await DataService.clearAll();

			await DataService.saveDocuments([mockDocument, secondMockDocument]);
			documentList = await DataService.listDocuments();
			expect(documentList.length).toBeGreaterThan(1);
			expect(documentList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						hash: secondMockDocument.hash
					})
				])
			);
		});

		it('updates document properly', async () => {
			const update = {
				name: 'Edited name'
			};
			await DataService.updateDocument(secondMockDocument.hash, { ...secondMockDocument, ...update });

			const updatedDoc = await DataService.getDocument(secondMockDocument.hash);
			expect(updatedDoc.name).not.toEqual(secondMockDocument.name);
		});
	});
});
