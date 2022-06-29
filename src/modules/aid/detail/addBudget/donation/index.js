import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Card, CardBody, CardTitle, Table} from "reactstrap";
import {dottedString} from "../../../../../utils";
import moment from "moment";
import {Link} from "react-router-dom";
import {APP_CONSTANTS, TOAST} from "../../../../../constants";
import API from "../../../../../constants/api";
import {getUserToken} from "../../../../../utils/sessionManager";
import {AidContext} from "../../../../../contexts/AidContext";

const Donation = (props) =>{
    // const { projectId} = props.projectId;
    const access_token = getUserToken();

    const [currentPage, setCurrentPage] = useState(1);
    const { PAGE_LIMIT } = APP_CONSTANTS;

    const [projectDetails, setProjectDetails] = useState(null);
    const {
        getAidDetails
    } = useContext(AidContext);
    const [donationList, setDonationList] = useState(null);

    const [agencyUserEmail, setAgencyUserEmail] = useState(null);

    const fetchProjectDetails = (projectId, agencyDetails) => {
        getAidDetails(projectId)
            .then(res => {
                setProjectDetails(res);
                fetchCampaignDetails(agencyDetails.agency.email, res);
            })
            .catch(err => {
                // addToast(err.message, TOAST.ERROR);
            });
    };
    const fetchAgencyUserDetails =(projectId) => {
        try{
            fetchAgencyDetails().then(agencyDetails => {
                setAgencyUserEmail(agencyDetails.agency.email);
                fetchProjectDetails(projectId, agencyDetails);
            });
        }catch(error){
            console.log("Exception while fetchAgencyUserDetails, ",error);
        }
    };


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
    const fetchCampaignDetails = (agencyUser, projectDetails) =>{
        axios.get(`${API.USERS}/token?email=${agencyUser}`,{
            headers: {access_token: access_token}
        }).then(token => {
            const fetchDonationUrl = API.FUNDRAISER_DONATION +"/campaign/"+projectDetails.campaignId
            axios.get(fetchDonationUrl, {
                headers: {Authorisation: `Bearer ${token.data}`}
            }).then(donationList=>{
                setDonationList(donationList.data.data);
            })
        });
    }

    useEffect(()=>{
        fetchAgencyUserDetails(props.projectId);
    },[]);

    return(
        <>
            <Card>
                <CardTitle >
                    Donations
                </CardTitle>

                <CardBody>
                    <Table className="no-wrap v-middle" responsive>
                        <thead>
                        <tr className="border-0">
                            <th className="border-0">S.N.</th>
                            <th className="border-0">Wallet Address</th>
                            <th className="border-0">Amount</th>
                            <th className="border-0">Donation Date</th>
                            <th className="border-0">Transaction Id</th>
                        </tr>
                        </thead>
                        <tbody>
                        {donationList && donationList.length >0 ? (
                            donationList.map((d, i) => {
                                return (
                                    <tr key={d.id}>
                                        <td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
                                        <td>{dottedString(d.walletAddress)}</td>
                                        <td>{dottedString(d.amount)} {d.amount ? 'BNB':''}</td>
                                        <td>{moment(d.createdDate).format('YYYY-MM-DD')}</td>
                                        <td>{dottedString(d.transactionId)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={2}></td>
                                <td>No data available.</td>
                                <td colSpan={2}></td>
                            </tr>
                        )}
                        </tbody>
                    </Table>

                </CardBody>
            </Card>
        </>
    )
}

export default Donation;
