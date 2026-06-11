const Header = ({ title, description, actions = [] }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 font-inter">
      {/* Left */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071437]">
          {title}
        </h1>

        <p className="text-sm text-[#5E6278] mt-2 max-w-2xl">{description}</p>
      </div>

      {/* Right Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer flex items-center gap-2

                ${
                  action.variant === "secondary"
                    ? `
                      bg-white
                      border border-gray-200
                      text-gray-700
                      hover:bg-gray-50
                    `
                    : `
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                    `
                }
              `}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
