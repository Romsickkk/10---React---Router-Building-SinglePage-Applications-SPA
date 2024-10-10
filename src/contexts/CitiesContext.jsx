import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    dispatch({ type: "loading" });

    setTimeout(() => {
      async function fetchCities() {
        try {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();

          dispatch({ type: "cities/loaded", payload: data });
        } catch (error) {
          dispatch({
            type: "rejected",
            payload: "There is error loading cities...",
          });
        }
      }
      fetchCities();
    }, 500);
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      // console.log(id, currentCity.id);
      if (id === currentCity.id) return;

      dispatch({ type: "loading" });

      setTimeout(async () => {
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
          dispatch({ type: "city/loaded", payload: data });
        } catch {
          dispatch({
            type: "rejected",
            payload: "There is error loading city...",
          });
        }
      }, 1000);
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        dispatch({ type: "city/created", payload: data });
      } catch (error) {
        alert("There is an error deleteing city");
      }
    }, 1000);
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    setTimeout(async () => {
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });

        dispatch({ type: "cities/deleted", payload: id });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There is an error loading data...",
        });
      }
    }, 1000);
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        isLoading,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was uset outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
