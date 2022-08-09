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
import {useToasts} from "react-toast-notifications";

const Donation = (props) =>{
    // const { projectId} = props.projectId;
    const access_token = getUserToken();
    const { addToast } = useToasts();
    const [currentPage, setCurrentPage] = useState(1);
    const { PAGE_LIMIT } = APP_CONSTANTS;

    const [projectDetails, setProjectDetails] = useState(null);
    const {
        getAidDetails
    } = useContext(AidContext);
    const [donationList, setDonationList] = useState(null);
    const [totalDonation, setTotalDonation] = useState(null);

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
                let totalDonations = 0;
                for (let i=0; i<donationList.data.data.length; i++){
                    const donation = donationList.data.data[i];
                    totalDonations += donation.amount;
                }
                setTotalDonation(totalDonations);
            })
        });
    }
    const copyAddress = (address) => {
        navigator.clipboard.writeText(address);
        addToast(`Copied to Clipboard`, TOAST.SUCCESS);
    };

    useEffect(()=>{
        fetchAgencyUserDetails(props.projectId);
    },[]);

    return(
        <>
            <Card>
                <CardTitle >
                    Donations ({totalDonation? totalDonation : 0}{totalDonation? ' BNB': ''})
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
                                        <td>
                                        <span
                                            onClick={() =>
                                                copyAddress(d.walletAddress)
                                            }
                                            className="c-p-primary"
                                        >
                                      {dottedString(d.walletAddress)}
                                            <span className=" ps-1">
                                        <i className="fa fa-copy "></i>
                                      </span>
                                    </span>
                                        </td>
                                        <td>{dottedString(d.amount)} {d.amount ? 'BNB':''}</td>
                                        <td>{moment(d.createdDate).format('YYYY-MM-DD')}</td>
                                        <td><a target="_blank"
                                               rel="noopener noreferrer"
                                               className="text-decoration-underline text-default"
                                               href={`https://testnet.bscscan.com/tx/${d.transactionId}`}>
                                            {dottedString(d.transactionId)}
                                            <span className=" ps-1">
                                        <i className="fa fa-paperclip"></i>
                                      </span>
                                        </a></td>
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
