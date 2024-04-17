import React from "react";
import { Pagination } from "react-bootstrap";


export default function TablePagination({currentPage, totalPAges, onPageChange}) {

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    let items = [];
    for (let number =1; number <= totalPAges; number++) {
        items.push(
            <Pagination.Item
            key={number}
            active={number===currentPage}
            onClick={() => handlePageChange(number)}
            >
                {number}

            </Pagination.Item>
        );
    }

    return(
        <div>
            <Pagination>{items}</Pagination>
        </div>
    );
}