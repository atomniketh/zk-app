import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { sidebar } from "./Sidebar";
import { SemaphoreSubgraph, SemaphoreEthers } from "@semaphore-protocol/data";
import SemaphoreCommunitiesABI from "../abi/SemaphoreCommunities.json";
import BlockiesSvg from 'blockies-react-svg';

const semaphoreCommunitiesAddress = process.env.REACT_APP_WBCONTRACT;
const semaphoreEthers = new SemaphoreEthers(process.env.REACT_APP_NETWORK, {
    address: process.env.REACT_APP_WBCONTRACT,
    startBlock: 0,
});

function AllGroups() {
    const [allGroups, setAllGroups] = useState([]);
    // const [allMembers, setAllMembers] = useState([]);
    const [allGroupsInfo, setAllGroupsInfo] = useState([]);
    // const [isActiveMember, setIsActiveMember] = useState("");
    const [myGroups, setMyGroups] = useState([]);
    const [accountAddress, setAccountAddress] = useState("");

    async function getGroups() {
        try {
            const provider = new ethers.providers.Web3Provider(
                window.ethereum,
                "any"
            );

            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                semaphoreCommunitiesAddress,
                SemaphoreCommunitiesABI.abi,
                signer
            );
            const accountAddress = await signer.getAddress();
            setAccountAddress(accountAddress);

            const numberOfEntities = await contract.getNumberOfEntities();
            const allGroups = [];
            let groupInfo;
            for (let index = 0; index < numberOfEntities; index++) {
                groupInfo = await contract.allEntities(index);
                allGroups[index] = groupInfo;
            }
            setAllGroups(allGroups);

            let allGroupsInfo = [];
            const semaphoreSubgraph = new SemaphoreSubgraph(process.env.REACT_APP_NETWORK);

            for (let i = 0; i < allGroups.length; i++) {
                try {
                    let groupToJoin = `group${allGroups[i].idEntity.toString()}`;
                    let GroupInfo = {
                        groupID: allGroups[i].idEntity.toString(),
                        userCommittment: localStorage.getItem(groupToJoin),
                        groupAdmin: await semaphoreSubgraph.getGroup(allGroups[i].idEntity.toString(), {
                            admin: true,
                        }),
                        allGroupMembers: await semaphoreEthers.getGroupMembers(
                            allGroups[i].idEntity.toString()
                        ),
                    };
                    allGroupsInfo.push(GroupInfo);
                    setAllGroupsInfo(allGroupsInfo);
                } catch (error) {
                    // console.log("Error: " + error);
                }
            }

            const myGroups = [];
            for (let i = 0; i < allGroupsInfo.length; i++) {
                let groupToJoin = `group${allGroups[i].idEntity.toString()}`;
                const foundGroups = allGroupsInfo.filter((groupInfo) => {
                    return groupInfo.allGroupMembers.some((member) =>
                        member.includes(localStorage.getItem(groupToJoin))
                    );
                });
                for (let foundGroup of foundGroups) {
                    myGroups.push(foundGroup.groupID);
                }
            }
            // console.log("myGroups: " + myGroups);
            setMyGroups(myGroups);
        } catch (error) {
            // console.error(error);
        }
    }

    useEffect(() => {
        getGroups();
    }, []);

    let tmpGroupAdmin = [];

    return (
        <>
            <div
                className="w3-container"
                style={{ marginLeft: "0", paddingLeft: "0" }}
            >
                {sidebar}
                <div className="w3-main" style={{ marginLeft: "250px" }}>
                    <div className="w3-container">
                        <h1>All Groups</h1>
                        <br />

                        <table className="w3-table-all">
                            <tbody>
                                <tr>
                                    <th>Group Name</th>
                                    <th>Options</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {allGroups.map((item, index) => {
                                    tmpGroupAdmin = allGroupsInfo.filter(id => id.groupAdmin.id === item.idEntity.toString()).map((item, index) => (item.groupAdmin.admin))
                                    // console.log(tmpGroupAdmin[0]);
                                    // if (myGroups.includes(item.idEntity.toString())) {
                                    return (
                                        <React.Fragment key={item.idEntity.toString()}>
                                            <tr>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    <BlockiesSvg
                                                        address={item.idEntity.toString()}
                                                        size={8}
                                                        scale={5}
                                                        defaultBackgroundColor='white'
                                                        style={{ verticalAlign: 'middle' }}
                                                    />
                                                    {" "}
                                                    <strong>
                                                        {item.entityName.toString()} {item.root}</strong>
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>

                                                    {myGroups.includes(item.idEntity.toString()) ? (
                                                        <span>
                                                            <a href={`/GroupMessages?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`} > Group Messages</a>
                                                        </span>)
                                                        : (
                                                            <a href={`/CreateIdentity?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}&entityEditor=${item.entityEditor.toString()}`} > Request Access</a>)
                                                    }

                                                </td>

                                                {tmpGroupAdmin[0] === accountAddress.toLowerCase() ? (
                                                    <td style={{ verticalAlign: 'middle' }}>
                                                        {" "}
                                                        <a
                                                            href={`/UpdateGroupName?index=${index}&entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}
                                                        >
                                                            Rename Group
                                                        </a>{" "}
                                                        |{" "}
                                                        <a
                                                            href={`/UpdateEditor?entityID=${item.idEntity.toString()}`}
                                                        >
                                                            Reassign Admin
                                                        </a>{" "}
                                                        |{" "}
                                                        <a
                                                            href={`/AddMember?entityID=${item.idEntity.toString()}&entityEditor=${item.entityEditor.toString()}&entityName=${item.entityName.toString()}`}
                                                        >
                                                            Add Member
                                                        </a>{" "}
                                                        | Remove Member{" "} |{" "}

                                                         <a href='nothing' onClick={() => navigator.clipboard.writeText(`/CreateIdentity?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}&entityEditor=${item.entityEditor.toString()}`)}>
                                                             Invite Link
                                                         </a>{" "}
                                                    </td>
                                                ) : (
                                                    <><td style={{ verticalAlign: 'middle' }}>
                                                        <Link
                                                            to={`/MessageAdmin?entityID=${item.idEntity.toString()}&entityName=${item.entityName.toString()}`}
                                                        >
                                                            Message Group Admin
                                                        </Link></td></>
                                                )}
                                            </tr>
                                        </React.Fragment>

                                    );
                                    // } else {
                                    //     return null;
                                    // }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );

}

export default AllGroups;