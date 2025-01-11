import css from "./modal.module.scss";
import cn from "classnames";

export const Modal = ({ onClose, onShow = false, children }) => {
  return (
    <>
      {onShow && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center sm:items-center">
              <div className="relative py-2 transform overflow-hidden rounded-xl  text-left shadow-xl transition-all sm:my-8">
                <button
                  className={"absolute top-4 right-3 self-end text-gray-200"}
                  onClick={onClose}
                >
                  X
                </button>

                <div
                  className={cn(
                    css.root,
                    "text-red-500 px-4 pb-4 pt-5 sm:p-6 sm:pb-4",
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
