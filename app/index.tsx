import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [photos, setPhotos] = useState<string[]>([]); // Array to store multiple image URIs
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null); // Ref for the camera instance

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      try {
        // Capture the photo and get its URI
        const photo = await cameraRef.current.takePictureAsync();
        setPhotos((prevPhotos) => [...prevPhotos, photo.uri]); // Add the new URI to the array

        // Save the photo to the gallery
        await MediaLibrary.createAssetAsync(photo.uri);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing={facing} 
          ref={cameraRef}  // Attach the camera reference
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.photoContainer}>
        {photos.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.photo} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cameraContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // Placeholder background color
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10, // Space between images
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});
