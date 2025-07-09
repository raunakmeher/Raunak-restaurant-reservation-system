import RestaurantDetails from './RestaurantDetails';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Route path="/restaurant/db/:id" element={<RestaurantDetails backend={true} />} />
    </div>
  );
}

export default App; 