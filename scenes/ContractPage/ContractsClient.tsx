"use client";

import Image from "next/image";

import { useEffect } from "react";

import "@/sass/scenes/_contractsClient.scss";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import { setAllCustomers } from "@/globalRedux/features/appSlice";

import ContractClientItem from "@/components/ContractClientItem/ContractClientItem";
import { StateProps } from "@/interface";
import { useGlobalContext } from "@/context/store";

const ContractsClient = () => {
  const dispatch = useDispatch();

  const { data } = useGlobalContext();

  const allCustomers = useSelector((state: StateProps) => state.allCustomers);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        if (data._id) {
          const response = await axios.post("/api/customers", {
            userID: data._id,
          });

          dispatch(setAllCustomers(response.data.customers));
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAllCustomers();
  }, [data, dispatch]);

  return (
    <div className="contracts__content__client">
      <div className="contracts__content__client__header">
        <div className="contracts__content__client__header__title">
          All Customers
        </div>
        <Image
          src="/assets/contracts/dot.png"
          alt="dot"
          width={24}
          height={24}
          className="contracts__content__client__header__icon"
        />
      </div>
      <div className="contracts__content__client__body">
        {allCustomers.length === 0 && (
          <div className="no__client">There is no client yet!</div>
        )}

        {allCustomers.map((client) => (
          <ContractClientItem key={client._id} {...client} />
        ))}
      </div>
    </div>
  );
};

export default ContractsClient;
