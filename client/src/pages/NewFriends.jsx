import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import NewFriendsList from "../components/newfriends/NewFriendsList";

function NewFriends() {
  const [limitPerPage] = useState(5);

  const [filterQuery, setFilterQuery] = useState("");

  const [page, setPage] = useState(1);

  const axiosPrivate = useAxiosPrivate();

  const [currentNewFriendsList, setCurrentNewFriendsList] = useState([]);

  const [totalItemsCount, setTotalItemsCount] = useState(null);

  const {
    user: { accessToken: token },
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      let items = [];
      try {
        const response = await axiosPrivate.get(
          `/users/newfriends?page=${page}&limit=${limitPerPage}&filter=${filterQuery.trim()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        items = response.data;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        toast.error(message);
      }
      return items;
    };

    fetchUsers().then((result) => {
      setCurrentNewFriendsList(result && result.data);
      setTotalItemsCount(parseInt(result?.totalCount ?? 0));
    });
  }, [page, limitPerPage, filterQuery, axiosPrivate, token]);

  return (
    <>
      <SideBar />

      <section className="w-full h-screen flex justify-center">
        <div className="container mx-auto lg:w-1/2 flex flex-col">
          <h1 className="text-center text-2xl xl:text-3xl text-white mt-4">
            Find New Friends
          </h1>
          <form className="mt-6 flex justify-center" onSubmit={(event) => event.preventDefault()}>
            <input
              type="text"
              onChange={(event) => setFilterQuery(event.target.value)}
              value={filterQuery}
              placeholder="Find a friend"
              className="input w-full max-w-xs"
            />
          </form>
          <NewFriendsList newFriendsArray={currentNewFriendsList} axiosPrivate={axiosPrivate} />
          <ReactPaginate
            nextLabel="next >"
            onPageChange={async (event) => {
              const currentPage = parseInt(event.selected) + 1;
              setPage(currentPage);
            }}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={Math.ceil(totalItemsCount / limitPerPage)}
            previousLabel="< previous"
            pageClassName="btn btn-sm p-0 w-8 h-8 flex"
            pageLinkClassName="flex w-full h-full justify-center items-center"
            previousClassName="btn btn-sm btn-outline hidden md:flex"
            nextClassName="btn btn-sm btn-outline hidden md:flex"
            breakLabel="..."
            containerClassName="btn-group mt-8 flex justify-center items-center"
            activeClassName="btn-active"
            disabledClassName="btn-disabled"
            renderOnZeroPageCount={null}
          />
        </div>
      </section>
    </>
  );
}

export default NewFriends;
