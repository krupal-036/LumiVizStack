import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HiSparkles } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";
import Alert from "./Alert";
import { AuthContext } from "../../context/AuthContext";

const VisualizeButton = ({
    text = "Start Visualizing",
    className = "",
}) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleVisualizeClick = () => {
        if (user) {
            navigate("/visualize");
        } else {
            setError("You must be logged in to visualize your data.");
            setTimeout(() => {
                navigate("/login", { state: { error: "Please login to continue" } });
            }, 1500);
        }
    };

    return (
        <div className="flex items-center justify-center mt-8">
            <button
                onClick={handleVisualizeClick}
                className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-[#0B0F19] shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 ${className}`}
            >
                <HiSparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                {text}
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {error && (
                <div className="mt-6 animate-fade-in-up">
                    <Alert message={error} type="error" />
                </div>
            )}
        </div>
    );
};

export default VisualizeButton;