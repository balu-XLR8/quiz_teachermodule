import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Online Quiz System</h1>
        <p className="text-xl text-gray-700 mb-8">
          Welcome to the college department's quiz platform.
        </p>
        <div className="space-y-4">
          <Link to="/teacher">
            <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              Enter as Teacher
            </Button>
          </Link>
          <Link to="/student">
            <Button className="w-full py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              Enter as Student
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="outline" className="w-full py-3 text-lg border-gray-300 text-gray-800 hover:bg-gray-100 shadow-sm">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;