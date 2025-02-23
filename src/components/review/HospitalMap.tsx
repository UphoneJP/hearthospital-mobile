import { useEffect, useRef } from "react"
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet } from "react-native"

import { type hospitalType } from "../../types/types"

interface PropsType {
    hospital: hospitalType
}
export default function HospitalMap ({hospital}:PropsType) {
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    if (hospital) {
      const timer = setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: hospital.lat,
          longitude: hospital.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }, 3000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hospital])

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
      latitude: hospital.lat,
      longitude: hospital.lng,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5
      }}
    >
      <Marker
        key={`marker-${hospital.lat}-${hospital.lng}`}
        coordinate={{ 
          latitude: hospital.lat, 
          longitude: hospital.lng
        }}
        title={hospital.hospitalname}
      />
    </MapView>
  )
}
const styles = StyleSheet.create({
  map: {
    height: 200,
    width: '100%',
    marginBottom: 8
  }
})
