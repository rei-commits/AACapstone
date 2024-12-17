const SplitBill = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Split Bill</h2>
      
      {/* Bill Details */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input 
          type="number" 
          placeholder="Enter total amount" 
          className="w-full text-2xl p-2 border rounded"
        />
        
        {/* Splitting Options */}
        <div className="mt-4 space-x-4">
          <button className="btn-primary">Split Equally</button>
          <button className="btn-primary">Custom Split</button>
          <button className="btn-primary">Scan Receipt</button>
        </div>
      </div>
      
      {/* People Splitting */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                J
              </div>
              <p className="font-medium">John</p>
            </div>
            <input 
              type="number" 
              placeholder="$0.00" 
              className="w-32 text-right border rounded p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 