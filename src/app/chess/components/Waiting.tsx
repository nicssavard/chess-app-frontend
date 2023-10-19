import { LoadingSpinner } from "@/components/ui/Loading";

const Waiting = () => {
  return (
    <div className=" rounded-lg bg-gray-900 p-6">
      <h1 className="text-2xl">Searching for an opponent</h1>
      <div className="flex justify-center">
        <LoadingSpinner size={60} />
      </div>
    </div>
  );
};

export default Waiting;
