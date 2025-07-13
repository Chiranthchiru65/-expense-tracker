import * as React from "react";

interface MonthlyCardProps {
  id: number;
  name: string;
  amount: number;
  icon: string;
}

const MonthlyCard: React.FunctionComponent<MonthlyCardProps> = ({
  id,
  name,
  amount,
  icon,
}) => {
  return (
    <>
      <div key={id} className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600">{icon}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">{name}</p>
            <p className="text-xl font-bold text-gray-900">{amount}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyCard;
