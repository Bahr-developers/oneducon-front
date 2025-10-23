import React from "react";
import { useTranslation } from "react-i18next";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select, SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface PropsType {
    postsPerPage: number
    totalPosts: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    setPostPerPage: React.Dispatch<React.SetStateAction<number>>
    currentPage: number
}

const PaginationContyent = ({ postsPerPage, totalPosts, setCurrentPage, setPostPerPage, currentPage }: PropsType) => {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const getVisiblePages = (current: number, total: number): (number | string)[] => {
        const delta = 1;
        const range: (number | string)[] = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        range.push(1);

        if (left > 2) range.push("...");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < total - 1) range.push("...");

        if (total > 1) range.push(total);

        return range;
    };
    const visiblePages = getVisiblePages(currentPage, totalPages);




    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <div className="ml-0 flex items-center justify-between w-full gap-3 mt-5">

            <div className="flex items-center gap-2">
                <Select onValueChange={(value) => setPostPerPage(Number(value))}>
                    <SelectTrigger className="">
                        <SelectValue placeholder={`${postsPerPage} tadan`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='5'>5 tadan</SelectItem>
                        <SelectItem value="10">10 tadan</SelectItem>
                        <SelectItem value="20">20 tadan</SelectItem>
                        <SelectItem value="50">50 tadan</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {totalPosts > postsPerPage && (
                <Pagination className="flex justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className="w-7 h-7 flex items-center justify-center p-0 text-[#9D9D9D]"
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                aria-label={t('pagination.previous')}
                            >
                                <span className="sr-only">{t('pagination.previous')}</span>
                            </PaginationPrevious>
                        </PaginationItem>

                        {visiblePages.map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "..." ? (
                                    <PaginationEllipsis className="text-[#9D9D9D]" />
                                ) : (
                                    <PaginationLink
                                        className={currentPage === page ? "hover:bg-[#056af7] hover:text-white bg-[#1677FF] text-white w-7 h-7 cursor-pointer"
                                            : "cursor-pointer text-[#9D9D9D]"}
                                        onClick={() => handlePageChange(Number(page))}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                className="w-7 h-7 flex items-center justify-center p-0 text-[#9D9D9D]"
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                aria-label={t('pagination.next')}
                            >
                                <span className="sr-only">{t('pagination.next')}</span>
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};
export const PaginationContyentServer = ({ postsPerPage, totalPosts, setCurrentPage, setPostPerPage, currentPage }: PropsType) => {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pageNumbers = [];

    for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
    }

    const getVisiblePages = (current: number, total: number): (number | string)[] => {
        const delta = 1;
        const range: (number | string)[] = [];
        const left = Math.max(1, current - delta);
        const right = Math.min(total - 2, current + delta);

        range.push(0); // birinchi sahifa (0-index)

        if (left > 1) range.push("...");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < total - 2) range.push("...");

        if (total > 1) range.push(total - 1); // oxirgi sahifa

        return range;
    };
    const visiblePages = getVisiblePages(currentPage, totalPages);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="ml-0 flex items-center justify-between w-full gap-3 p-3">
            <div className="flex items-center gap-2">
                <Select onValueChange={(value) => setPostPerPage(Number(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder={`${postsPerPage} ${t('pagination.perPage')}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 {t('pagination.perPage')}</SelectItem>
                        <SelectItem value="10">10 {t('pagination.perPage')}</SelectItem>
                        <SelectItem value="20">20 {t('pagination.perPage')}</SelectItem>
                        <SelectItem value="50">50 {t('pagination.perPage')}</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {t('pagination.page')} {currentPage + 1} {t('pagination.of')} {totalPages}
                </span>
            </div>
            {totalPosts > postsPerPage && (
                <Pagination className="flex justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className="w-7 h-7 flex items-center justify-center p-0 text-[#9D9D9D]"
                                onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                                aria-label={t('pagination.previous')}
                            >
                                <span className="sr-only">{t('pagination.previous')}</span>
                            </PaginationPrevious>
                        </PaginationItem>

                        {visiblePages.map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "..." ? (
                                    <PaginationEllipsis className="text-[#9D9D9D]" />
                                ) : (
                                    <PaginationLink
                                        className={
                                            currentPage === page
                                                ? "hover:bg-[#056af7] hover:text-white bg-[#1677FF] text-white w-7 h-7 cursor-pointer"
                                                : "cursor-pointer text-[#9D9D9D]"
                                        }
                                        onClick={() => handlePageChange(Number(page))}
                                    >
                                        {Number(page) + 1}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                className="w-7 h-7 text-[#9D9D9D] flex items-center justify-center p-0"
                                onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                                aria-label={t('pagination.next')}
                            >
                                <span className="sr-only">{t('pagination.next')}</span>
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};


export default PaginationContyent;
