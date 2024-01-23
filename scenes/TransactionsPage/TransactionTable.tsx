"use client";

import { useState, useEffect, useRef } from "react";

import Image from "next/image";

import axios from "axios";

import "@/sass/scenes/_transactionsTable.scss";

import TransactionsTableItem from "@/components/TransactionsTableItem/TransactionsTableItem";

import { filterActionsTable } from "@/helpers";

import { useSelector, useDispatch } from "react-redux";
import { StateProps } from "@/interface";

import { useTranslation } from "@/i18n/client";
import { useGlobalContext } from "@/context/store";
import { setTransactions } from "@/globalRedux/features/appSlice";

const TransactionTable = () => {
  const [check, setCheck] = useState(false);
  const [serverError, setServerError] = useState("");

  const transactions = useSelector((state: StateProps) => state.transactions);

  const [actionsData, setActionsData] = useState(transactions);

  const dispatch = useDispatch();

  const { data } = useGlobalContext();

  const effectRef = useRef(false);

  useEffect(() => {
    if (effectRef.current === false) {
      const fetchTransactions = async () => {
        try {
          if (data._id) {
            const response = await axios.get(`/api/transactions/${data._id}`);

            dispatch(setTransactions(response.data.transactions));
          }
        } catch (error: any) {
          setServerError(error.response.data.message);
        }
      };

      fetchTransactions();
    }

    return () => {
      effectRef.current = true;
    };
  }, [data._id, dispatch]);

  useEffect(() => {
    setActionsData(transactions);
  }, [transactions]);

  const handleSort = (input: string) => {
    setCheck((prevValue) => !prevValue);

    const sortedData =
      filterActionsTable({ input, data: transactions, check }) || [];
    setActionsData(sortedData);
  };

  const curLang = useSelector((state: StateProps) => state.curLang);

  const { t } = useTranslation(curLang);

  return (
    <div className="transactions__table">
      <div className="transactions__table__header">
        <div className="transactions__table__header__title">
          {t("actions.table.title")}
        </div>
      </div>
      <div className="transactions__table__content">
        <div className="transactions__table__content__sortBtns">
          <button
            className="transactions__table__content__sortBtns__item"
            onClick={() => handleSort("client")}
          >
            {t("actions.table.filter1")}
            <Image
              src="/assets/transactions/arrows.png"
              alt="arrows"
              width={24}
              height={24}
            />
          </button>
          <div className="transactions__table__content__sortBtns__middleGroup">
            <button
              className="transactions__table__content__sortBtns__element"
              onClick={() => handleSort("payment")}
            >
              {t("actions.table.filter2")}
              <Image
                src="/assets/transactions/arrows.png"
                alt="arrows"
                width={24}
                height={24}
              />
            </button>
            <button className="transactions__table__content__sortBtns__element">
              {t("actions.table.filter3")}
              <Image
                src="/assets/transactions/arrows.png"
                alt="arrows"
                width={24}
                height={24}
              />
            </button>
            <button
              className="transactions__table__content__sortBtns__element"
              onClick={() => handleSort("amount")}
            >
              {t("actions.table.filter4")}
              <Image
                src="/assets/transactions/arrows.png"
                alt="arrows"
                width={24}
                height={24}
              />
            </button>
          </div>

          <button className="transactions__table__content__sortBtns__item">
            {t("actions.table.filter5")}
            <Image
              src="/assets/transactions/arrows.png"
              alt="arrows"
              width={24}
              height={24}
            />
          </button>
        </div>
        <div className="transactions__table__content__actions">
          {actionsData.length === 0 ? (
            <div className="no__action">There is no action yet!</div>
          ) : (
            actionsData.map((action) => (
              <TransactionsTableItem key={action._id} {...action} />
            ))
          )}
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

export default TransactionTable;
