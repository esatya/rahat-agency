import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Card,
    CardBody,
    Col,
    Form,
    FormGroup,
    Input,
    Row
} from 'reactstrap';
import {useHistory} from "react-router-dom";
import {API_SERVER, TOAST} from "../../../../constants";
import axios from "axios";
import {getUserToken} from "../../../../utils/sessionManager";
import API, {FUNDRAISER_CAMPAIGN} from "../../../../constants/api";

import BreadCrumb from '../../../ui_components/breadcrumb';
import {AppContext} from "../../../../contexts/AppSettingsContext";
import GrowSpinner from "../../../global/GrowSpinner";
import {useToasts} from "react-toast-notifications";
import moment from "moment";
import SelectWrapper from "../../../global/SelectWrapper";
import { Editor } from 'react-draft-wysiwyg';
import {EditorState, convertToRaw} from "draft-js";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {getAidDetails} from "../../../../services/aid";

import web3 from 'web3';
import UploadList from "../tab/uploadList";
import ModalWrapper from "../../../global/CustomModal";


export default function AddCampaign({match}) {
    const { addToast } = useToasts();
    const { loading, setLoading } = useContext(AppContext);
    const access_token = getUserToken();
    const history = useHistory();
    const { projectId } = match.params;

    const [walletOptions, SetWalletOptions] = useState(["Binance"]);

    useEffect(() => {
        SetWalletOptions(["Binance"]);
    }, [])

    const [image, setImage] = useState(null);

    const [value, setValue] = useState({
        title: '',
        excerpt: '',
        story: EditorState.createEmpty(),
        target: '',
        expiryDate: '',
        walletType: 'Binance',
        walletAddress: '',
    });
    const [wallets, setWallets] = useState([]);

    const removeWallet = (index) => {
        const newWallets = value.wallets?.filter((item, idx) => index !== idx);
        setWallets(newWallets);
    };

    const checkUserExists = async (token) => {
        return new Promise((resolve, reject) => {
            const checkUserUrl = API.CheckUserExistsURL;
            const requestBody = {
                "email": agencyUserEmail
            }
            const checkUserResponse = axios.post(checkUserUrl, requestBody,{headers: {authorization: `Bearer ${token}`}} )
                .then(res => {
                    if (res.statusText === 'OK') {
                        resolve(res.data);
                    }
                    reject(res.data);
                })
                    .catch(err => {
                        reject(err);
                    });
            return checkUserResponse;
        });
    }

    const handleWalletSave = (event) => {
        event.preventDefault();
        const isValidAddress = web3.utils.isAddress(value.walletAddress);
        // if (true) {
        if (isValidAddress) {
            setWallets(
                wallets.concat({
                    name: value?.walletType || 'Binance',
                    walletAddress: value?.walletAddress,
                }),
            );
        } else {
            addToast('Please enter correct wallet address.', TOAST.ERROR);
        }
        setValue((previous) => {
            return {
                ...previous,
                walletType: 'Binance',
                walletAddress: '',
            };
        });
    };

    const [projectDetails, setProjectDetails] = useState(null);

    const fetchProjectDetails = () => {
        getAidDetails(projectId)
            .then(res => {
                setProjectDetails(res);
                setValue({ ...value, ['title']: res.name });
            })
            .catch(err => {
                addToast(err.message, TOAST.ERROR);
            });
    };

    useEffect(()=>{
        fetchProjectDetails()
        fetchAgencyUserDetails()
    }, [])

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        registerFundraise(0);
    };

    const RegisterAsDraft = (e) => {
        e.preventDefault();
        registerFundraise(1);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [agencyUserEmail, setAgencyUserEmail] = useState(null);
    function fetchAgencyDetails() {
        return new Promise((resolve, reject) => {
            const agencyDetailsUrl = API.SETTINGS;

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

    const fetchAgencyUserDetails =() => {
        try{
            fetchAgencyDetails().then(agencyDetails => {
                setAgencyUserEmail(agencyDetails.agency.email);
            });
        }catch(error){
            console.log("Exception while fetchAgencyUserDetails, ",error);
        }
    };

    async function createCampaign(formData, token) {
        try {

            setLoading(false);
            const resData = await axios.post(`${API.FUNDRAISER_CAMPAIGN}/add`,
                formData, {headers: {Authorization: `Bearer ${token.data}`}});

            const campaignToProject = await axios.post(`${API.PROJECTS}/${projectId}/addCampaign`,
                {
                    'campaignId': resData.data.data.id,
                    'campaignTitle': resData.data.data.title
                },
                {headers: {access_token: access_token}})

            if (campaignToProject) {
                setLoading(false);
                addToast("Campaign Added Successfully", TOAST.SUCCESS);
                history.goBack();
            }

        } catch (e) {
            setLoading(false);
            addToast(e.message, TOAST.ERROR);
        }
    }

    const registerFundraise = async (saveAsDraft) => {
        if (wallets?.length <= 0) {
            addToast("Please add at least one wallet.", TOAST.WARNING);
            return;
        }
        if (value.title.length <= 0){addToast("Title cannot be blank", TOAST.WARNING);
            return
        }
        if (value.excerpt.length <= 0){
            addToast("Tagline cannot be blank", TOAST.WARNING);
            return
        }
        if (value.target.length <= 0){
            addToast("Target Amount cannot be blank", TOAST.WARNING);
            return
        }

        if (value.expiryDate.length <= 0){
            addToast("Campaign End Date cannot be blank", TOAST.WARNING);
            return
        }
        if (value.excerpt?.length > 100) {
            addToast("Tagline Cannot be more than 100 words.", TOAST.WARNING);
            return;
        }

        if (value.title?.length <= 0) {
            addToast("Please enter the title",TOAST.WARNING);
            return;
        }

        const formData = new FormData();
        formData.append('title', value.title);
        formData.append('excerpt', value.excerpt || '');
        formData.append(
            'story',
            JSON.stringify(convertToRaw(value.story.getCurrentContent())),
        );
        formData.append('target', value.target);
        formData.append('expiryDate', moment(value.expiryDate).format('YYYY-MM-DD'));
        formData.append('image', image);
        formData.append('wallets', JSON.stringify(wallets));
        formData.append('status', saveAsDraft ? 'DRAFT' : 'PUBLISHED');

        const tokenResponse = await axios.get(`${API.USERS}/token?email=${agencyUserEmail}`,{
            headers: {access_token: access_token}
        });
        if(tokenResponse){
            setToken(tokenResponse);
            checkUserExists(tokenResponse.data).then((userDetails) =>{
                if (userDetails && userDetails.userExists) {
                    createCampaign(formData, tokenResponse).then(campaignCreated =>{
                        console.log(campaignCreated)
                    });
                }else{
                    setFormDataModal(formData);
                    setAddUserModal(true);

                }
            });
        }else{
            addToast("Error while connecting to Server");
            setLoading(false);
        }

    }
    const [token, setToken] = useState(null);
    const [formDataModal, setFormDataModal] = useState(null);
    const handleCreateAgencyUser = async e =>{
        e.preventDefault();
        setLoading(true);
        setAddUserModal(false);
        const createUser = API.CreateUserFundraiserURL
        axios.post(createUser, {
            email: agencyUserEmail,
            alias: agencyUserEmail.slice(0,4),
            isAgency: true
        }).then(userCreated =>{
            if(userCreated) {
                addToast("User created in fundraiser", TOAST.SUCCESS);
                createCampaign(formDataModal, token).then(campaignCreated => {
                    console.log(campaignCreated)
                });
            }
            else addToast("Error while creating an user", TOAST.ERROR)
        }).catch(error=>{
            addToast("Error while registering User, "+ error, TOAST.ERROR );
            setLoading(false);
        })
    }
    const [addUserModal, setAddUserModal] = useState(false);
    const toggleAddUserModal = () => setAddUserModal(!addUserModal);
    const handleInputChange = e => {
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    const handleWalletTypeChange = e =>{
        setValue({...value, ["walletType"]: e.value})
    }

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
       <>
           <FormGroup>
               <p className="page-heading">Create your fundraising campaign</p>
               <BreadCrumb redirect_path="projects" root_label = "Projects" current_label="Enter your Details" />
               <Row>
                   <Col md="10">
                       <Card>
                           <CardBody>
                            <Form style={{color: '#6B6C72'}}>
                                <FormGroup>
                                    <label htmlFor="fname" className="form-label"><strong>Title</strong></label>
                                    <Input type="text" value={value.title} name="title" placeholder = "Max 50 letters" onChange={handleInputChange} required />
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="fname" className="form-label"><strong>Tagline</strong></label>
                                    <Input type="text" value={value.excerpt} name="excerpt" placeholder = "Max 100 letters" onChange={handleInputChange} required />
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="fname" className="form-label"><strong>Share Your Story</strong></label>
                                    <Editor
                                        editorState={value?.story}
                                        wrapperClassName="border border-1 p-2"
                                        editorClassName="editer-content"
                                        onEditorStateChange={(editorState) => {
                                            setValue((previous) => {
                                                return {
                                                    ...previous,
                                                    story: editorState,
                                                };
                                            });
                                        }}
                                    />
                                </FormGroup><FormGroup>
                                    <label htmlFor="formFileSm" className="form-label mt-3">
                                        Upload photo that best defines your fundraiser
                                        campaign
                                    </label>
                                    <Input
                                        className="form-control form-control-sm"
                                        id="formFileSm"
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <label htmlFor="fname" className="form-label">
                                                    <strong>Your blockchain network</strong>
                                                </label>
                                                <SelectWrapper
                                                    id="project_manager"
                                                    onChange={handleWalletTypeChange}
                                                    maxMenuHeight={200}
                                                    currentValue={[{ value: 'Binance', label: 'Binance' }]}
                                                    data={[{ value: 'Binance', label: 'Binance' }]}
                                                    placeholder="Select WalletType"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col>
                                            <label htmlFor="fname" className="form-label">
                                                <strong>Your Wallet address</strong>
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Wallet address"
                                                className=" my-auto"
                                                name="walletAddress"
                                                value={value?.walletAddress}
                                                onChange={handleInputChange}
                                                style={{ height: 35 }}
                                            />
                                        </Col>
                                        <Col>
                                            <Button
                                                style={{"margin": "30px"}}
                                                type="button"
                                                className="btn btn-primary submit-btn"
                                                onClick={handleWalletSave}
                                            >Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <label> <strong>Linked Wallets</strong> </label>
                                    {wallets?.map((wallet, index) => (
                                        <p className="mb-0" key={index}>
                                            <small>
                                                {' '}
                                                <img
                                                    // src={bnbImage}
                                                    height={20}
                                                    style={{ marginTop: '-0.3rem' }}
                                                />
                                                &nbsp;{wallet?.name}: {wallet?.walletAddress}
                                            </small>
                                            <span
                                                className="text-danger c-p"
                                                onClick={() => removeWallet(index)}
                                            >
                              &nbsp; <i className="fa fa-trash"></i>
                            </span>
                                        </p>
                                    ))}
                                </FormGroup>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <label>
                                                <strong>How much do you want to raise?</strong>
                                            </label>
                                            <Input
                                                type="number"
                                                className="form-control"
                                                name="target"
                                                id="fname"
                                                placeholder="Enter amount in BNB"
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col>
                                        <FormGroup>
                                            <label>
                                                Campaign End Date
                                            </label>
                                            <Input
                                                type="date"
                                                min={moment().add('1', 'day').format('YYYY-MM-DD')}
                                                className="form-control"
                                                name="expiryDate"
                                                id="expiryDate"
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <CardBody style={{ paddingLeft: 0 }}>
                                    {loading ? (
                                        <GrowSpinner />
                                    ) : (
                                        <div>
                                            <Button  className="btn btn-info"
                                            onClick={handleFormSubmit}>
                                                <i className="fa fa-check"></i> Publish Campaign
                                            </Button>
                                            {/*<Button*/}
                                            {/*    type="button"*/}
                                            {/*    onClick={RegisterAsDraft}*/}
                                            {/*    style={{ borderRadius: 8 }}*/}
                                            {/*    className="btn btn-info ml-2"*/}
                                            {/*>*/}
                                            {/*    Save as draft*/}
                                            {/*</Button>*/}

                                            <ModalWrapper
                                                toggle={toggleAddUserModal}
                                                open={addUserModal}
                                                title= "Create Agency User in Fundraiser"
                                                handleSubmit={handleCreateAgencyUser}
                                                loading={false}
                                                size="l"
                                            >
                                                <>
                                                    <p> Create an agency user in fundraiser? </p>
                                                    <p>Email: </p>
                                                <p>${agencyUserEmail}</p>
                                                </>
                                            </ModalWrapper>
                                        </div>
                                    )}
                                </CardBody>
                            </Form>
                           </CardBody>
                       </Card>
                   </Col>
               </Row>
           </FormGroup>
       </>
    );
}
