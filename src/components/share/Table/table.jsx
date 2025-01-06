import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "../Checkbox/checkbox.jsx";
import { FIELD_TYPES } from "../../../utils/constants.js";
import { capitalizeFirstLetter } from "../../../pages/Stats/utils.js";

export const Table = ({ columns, data = [], onClickRow }) => {
  const [currentData, setCurrentData] = useState([]); // Текущее отображаемое состояние данных
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [currentPage, setCurrentPage] = useState(0); // Текущая страница
  const [hasMore, setHasMore] = useState(true); // Есть ли еще данные для подгрузки
  const itemsPerPage = 20; // Количество строк на одну подгрузку
  const tableRef = useRef(null); // Реф для отслеживания прокрутки

  useEffect(() => {
    // Сбрасываем состояние при изменении входных данных
    setCurrentData([]);
    setCurrentPage(0);
    setHasMore(true);
    loadMoreData([], 0);
  }, [data]); // Отслеживаем изменения внешних данных

  useEffect(() => {
    // Добавляем обработчик скролла
    const handleScroll = () => {
      if (!tableRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        loadMoreData(currentData, currentPage);
      }
    };

    const container = tableRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, currentData, currentPage]);

  const loadMoreData = (existingData, page) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newData = data.slice(startIndex, endIndex);

      setCurrentData([...existingData, ...newData]);
      setCurrentPage(page + 1);

      if (newData.length < itemsPerPage) {
        setHasMore(false); // Если больше данных нет
      }

      setLoading(false);
    }, 300); // Эмуляция задержки
  };

  return (
    <div
      className="relative pb-14"
      ref={tableRef}
      style={{
        height: "100%",
        maxHeight: "calc(100vh - 350px )",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-15">
        <thead
          className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10"
          style={{ zIndex: 10 }}
        >
          <tr>
            {columns.map((column) => (
              <th
                scope="col"
                className="px-6 py-3"
                key={column.subId ? column.id + "_" + column.subId : column.id}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr
              className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-900"
              key={index}
              onClick={() => (onClickRow ? onClickRow(item) : null)}
            >
              {columns.map((column) => {
                if (column.type === FIELD_TYPES.CHECKBOX) {
                  return (
                    <td className="px-6 py-4" key={column.id}>
                      <div>
                        <Checkbox
                          className="flex justify-start"
                          checked={
                            item[column.id] === "Yes" ||
                            item[column.id] === true
                          }
                          readOnly
                        />
                      </div>
                    </td>
                  );
                }

                return (
                  <td
                    className="px-6 py-4"
                    key={
                      column.subId ? column.id + "_" + column.subId : column.id
                    }
                  >
                    {column.subId
                      ? capitalizeFirstLetter(item[column.id][column.subId])
                      : capitalizeFirstLetter(item[column.id]) || "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="text-center py-4 text-gray-500">Загрузка...</div>
      )}
    </div>
  );
};
