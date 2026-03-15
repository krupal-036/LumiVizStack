import { useState } from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";

const Alert = ({ message, type = "error" }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;
    const styles = {
        error: {
            container: "bg-red-600/10 dark:bg-red-900/30 border-red-600 dark:border-red-500",
            bar: "bg-red-600 dark:bg-red-500",
            text: "text-red-600 dark:text-red-400",
            icon: "text-red-600 dark:text-red-400",
        },
        success: {
            container: "bg-green-600/10 dark:bg-green-900/30 border-green-600 dark:border-green-500",
            bar: "bg-green-600 dark:bg-green-500",
            text: "text-green-600 dark:text-green-400",
            icon: "text-green-600 dark:text-green-400",
        },
    };

    const currentStyle = styles[type];

    return (
        <div
            className={`flex items-center justify-between max-w-fit w-full h-10 shadow ${currentStyle.container}`}
        >
            <div className={`h-full w-1.5 ${currentStyle.bar}`}></div>
            <div className="flex items-center p-4">
                <FiAlertCircle className={`text-lg mr-2 ${currentStyle.icon}`} />
                <p className={`text-sm ${currentStyle.text}`}>{message}</p>
            </div>
            <button
                type="button"
                aria-label="close"
                onClick={() => setIsVisible(false)}
                className="active:scale-90 transition-all mr-3"
            >
                <FiX className={currentStyle.text} />
            </button>
        </div>
    );
};

export default Alert;