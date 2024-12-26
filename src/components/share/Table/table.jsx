import { Checkbox } from "../Checkbox/checkbox.jsx";
import { FIELD_TYPES } from "../../../utils/constants.js";
import { capitalizeFirstLetter } from "../../../pages/Stats/utils.js";

export const Table = ({ columns, data = [], onClickRow, isFooter = true }) => {
  if (!data) return false;

  return (
    <>
      <div className="relative overflow-x-auto pb-14">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-15">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => {
                return (
                  <th
                    scope="col"
                    className="px-6 py-3"
                    key={
                      column.subId ? column.id + "_" + column.subId : column.id
                    }
                  >
                    {column.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <>
              {data.map((item, index) => {
                return (
                  <tr
                    className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-900"
                    key={index}
                    onClick={() => (onClickRow ? onClickRow(item) : null)}
                  >
                    {columns.map((column) => {
                      if (column.type == FIELD_TYPES.CHECKBOX) {
                        return (
                          <td className=" px-6 py-4" key={column.id}>
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
                            column.subId
                              ? column.id + "_" + column.subId
                              : column.id
                          }
                        >
                          {column.subId
                            ? capitalizeFirstLetter(
                                item[column.id][column.subId],
                              )
                            : capitalizeFirstLetter(item[column.id]) || "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          </tbody>
        </table>
        {isFooter && (
          <div className={"fixed left-0 bottom-0 right-0"}>
            <div className="w-full bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <div className="px-6 py-4">Count: {data.length}</div>
            </div>
          </div>
        )}

        {/*<nav aria-label="Page navigation example">*/}
        {/*  <ul className="inline-flex -space-x-px text-sm">*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"*/}
        {/*      >*/}
        {/*        Previous*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"*/}
        {/*      >*/}
        {/*        1*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"*/}
        {/*      >*/}
        {/*        2*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        aria-current="page"*/}
        {/*        className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"*/}
        {/*      >*/}
        {/*        3*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"*/}
        {/*      >*/}
        {/*        4*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"*/}
        {/*      >*/}
        {/*        5*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"*/}
        {/*      >*/}
        {/*        Next*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</nav>*/}
      </div>
    </>
  );
};
