"use client";

import { Flex, Text, Button } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // obtener las páginas visibles
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <Flex
      direction={{ initial: "column", sm: "row" }}
      justify="between"
      align="center"
      gap="4"
      p="4"
    >
      {totalItems && itemsPerPage && (
        <Text size="2" color="gray">
          Mostrando {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}{" "}
          ítems
        </Text>
      )}

      <Flex gap="2" align="center">
        <Button
          variant="soft"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
          Anterior
        </Button>

        <Flex gap="1" display={{ initial: "none", sm: "flex" }}>
          {visiblePages[0] > 1 && (
            <>
              <Button variant="soft" onClick={() => onPageChange(1)}>
                1
              </Button>
              {visiblePages[0] > 2 && (
                <Text color="gray" style={{ padding: "0 8px" }}>
                  ...
                </Text>
              )}
            </>
          )}

          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "solid" : "soft"}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <Text color="gray" style={{ padding: "0 8px" }}>
                  ...
                </Text>
              )}
              <Button variant="soft" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </Button>
            </>
          )}
        </Flex>

        <Button
          variant="soft"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <ChevronRightIcon />
        </Button>
      </Flex>
    </Flex>
  );
}
