import SideBar from "../components/SideBar";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  reset,
  fetchFriendRequests,
} from "../features/friendrequest/friendRequestSlice";
import Spinner from "../components/Spinner";
import RequestList from "../components/friendrequests/RequestList";

function Requests() {
  const axiosPrivate = useAxiosPrivate();
  const { isLoading, friendRequests, isError, message, isSuccess } = useSelector(
    (state) => state.friendRequest
  );

  const dispatch = useDispatch();
  useEffect(() => {
    let abortController = new AbortController();
    dispatch(
      fetchFriendRequests({
        axiosPrivate,
        abortController,
      })
    );

    return () => {
      abortController.abort();
    };
  }, [axiosPrivate, dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isError, message, isSuccess, dispatch, axiosPrivate]);

  return (
    <>
      <SideBar />

      {isLoading ? (
        <Spinner />
      ) : (
        <section className="w-full h-screen flex justify-center">
          <div className="container mx-auto lg:w-1/2 flex flex-col">
            <h1 className="text-center text-2xl xl:text-3xl text-white mt-4">
              Friends Requests
            </h1>

            <RequestList requests={friendRequests} axiosPrivate={axiosPrivate} />
          </div>
        </section>
      )}
    </>
  );
}

export default Requests;
