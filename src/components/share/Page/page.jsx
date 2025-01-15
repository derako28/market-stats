import { Header } from "../Header/header.jsx";
import { Button } from "../Button/button.jsx";
import React, { useState } from "react";
import { PageSettings } from "../../../pages/Reports/components/share/PageSettings.jsx";
import { Modal } from "../Modal/modal.jsx";

export const Page = ({ children, noHeader, className }) => {
  // const [onShowSettingModal, setOnShowSettingModal] = useState(false);
  //
  // const onChangeSettings = (data) => {
  //   setVisibilityReports(data);
  // };

  return (
    <div className={className}>
      {/*<Button*/}
      {/*  className={"absolute right-5 top-5"}*/}
      {/*  onClick={() => setModalData(true)}*/}
      {/*>*/}
      {/*  <svg*/}
      {/*    className="w-6 h-6 text-gray-800 dark:text-white"*/}
      {/*    aria-hidden="true"*/}
      {/*    xmlns="http://www.w3.org/2000/svg"*/}
      {/*    fill="currentColor"*/}
      {/*    viewBox="0 0 20 20"*/}
      {/*  >*/}
      {/*    <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />*/}
      {/*  </svg>*/}
      {/*</Button>*/}

      {/*<Modal onClose={() => setOnShowSettingModal(false)} onShow={onShowSettingModal}>*/}
      {/*  <div className={"mt-5 text-gray-200"}>*/}
      {/*    <PageSettings onChange={onChangeSettings} />*/}
      {/*  </div>*/}
      {/*</Modal>*/}

      {!noHeader && <Header />}
      {children}
    </div>
  );
};
