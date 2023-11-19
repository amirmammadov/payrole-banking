"use client";

import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";

import { useGlobalContext } from "@/context/store";

import { definedContracts } from "@/constants";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import { usePathname, useRouter } from "next/navigation";

import "@/sass/layout/_avatarDetail.scss";

import Button from "@/components/Button/Button";
import { StateProps } from "@/interface";
import {
  setUserCardInfo,
  setInsuranceCompleted,
} from "@/globalRedux/features/appSlice";

interface Props {
  hasBtn?: boolean;
}

const AvatarDetail = ({ hasBtn }: Props) => {
  const [serverError, setServerError] = useState("");

  const { userCard, companyContracts } = useSelector(
    (state: StateProps) => state,
  );

  const { data } = useGlobalContext();

  const dispatch = useDispatch();

  const currentPage = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchCardInfo = async () => {
      try {
        if (data._id && (currentPage === "/" || currentPage === "/cards")) {
          const response = await axios.post("/api/card/fetch", {
            userID: data._id,
          });

          if (response.data.card[0] !== undefined) {
            dispatch(setUserCardInfo(response.data.card[0]));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    dispatch(setInsuranceCompleted(data.insuranceCompleted));

    fetchCardInfo();
  }, [currentPage, data, dispatch]);

  const activeContracts = companyContracts.map(
    (contract: any) => contract.company,
  );

  const isContractAvailable =
    definedContracts.length !== activeContracts.length;

  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout");
      router.push("/signin");
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <div className="avatar__detail">
      {hasBtn && userCard._id !== -1 && isContractAvailable && (
        <Button
          text="create a contract"
          icon="frame.png"
          url="en/contracts/create"
        />
      )}
      <Image
        src="/assets/home/notification.png"
        alt="notification"
        width={24}
        height={24}
        className="avatar__detail__notify"
      />
      <div className="avatar__detail__person">
        <Image
          src={`/assets/user/user.png`}
          alt={data.firstName}
          width={40}
          height={40}
          className="avatar__detail__person__img"
        />
        <div className="avatar__detail__person__info">
          <div className="avatar__detail__person__info__name">
            {data.firstName}
          </div>
          <div className="avatar__detail__person__info__position">
            {data.job}
          </div>
        </div>
        <div className="avatar__detail__person__dropdown">
          <Link
            href="/settings"
            className="avatar__detail__person__dropdown__profile"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="avatar__detail__person__dropdown__logoutBtn"
          >
            Logout
          </button>
        </div>
      </div>
      {serverError !== "" && (
        <div className="pop-up pop-up__error">
          <h2 className="pop-up__text__error">{serverError}</h2>
        </div>
      )}
    </div>
  );
};

export default AvatarDetail;
