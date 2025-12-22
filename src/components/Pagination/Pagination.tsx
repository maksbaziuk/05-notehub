import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
};

export default Pagination;
