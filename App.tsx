import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  runOnUI,
} from 'react-native-reanimated'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IMAGE_WIDTH = 100; // Adjust this value based on your image width

// List of images

const imagelist = [
  { key:1, image:'https://images.pexels.com/photos/50594/sea-bay-waterfront-beach-50594.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { key:2, image:'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=600' },
  { key:3,  image:'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { key:4, image:'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { key:5,  image:'https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { key:6,  image:'https://images.pexels.com/photos/2627063/pexels-photo-2627063.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { key:7,  image:'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=600' }
];



const App: React.FC = () => {


  
 
  const [longPressedImage, setLongPressedImage] = useState<any>();
  const[ isLongPressed, setIsLongPressed] = useState<boolean>(false);
  const [images,setImages] = useState<any>(imagelist);
  const [isInBottomContainer, setIsInBottomContainer] = useState<boolean>(false);
  const [draggedImage, setDraggedImage] = useState<any>();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);


  
  
  

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = 0;
      ctx.startY = 0;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;

    },
    onEnd: (_) => {
      if(translateY.value > SCREEN_HEIGHT*0.5){
         
        runOnJS(setIsInBottomContainer)(true);
       
      }
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          runOnJS(setIsLongPressed)(false);
    },
  });

  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value},
          { translateY: translateY.value },
        ],
      };
    });

  
  
  const onLongPress = (item: any) => {
    console.log('Long pressed on image:', item.key);
    removeImage();
    setIsLongPressed(true);
    setLongPressedImage(item);
    setDraggedImage(item);
    
  };

  const removeImage = () => {
    setIsInBottomContainer(false);
  }

  useEffect(() => {
    console.log(isLongPressed)
    if(!isLongPressed && longPressedImage){
      setTimeout(() => {
        setLongPressedImage(undefined);
      },2000)
    }
  },[isLongPressed])

  const renderItem = ({ item}: { item: any }) => {
    return (
      <TouchableWithoutFeedback  onLongPress={() => onLongPress(item)}>


         <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View
            style={[
              longPressedImage === item && animatedStyle,]}
            
          >
            <View style={item.key === 7 ? {width:0,height:0} :styles.imageContainer}>
       
          <Image source={{ uri: item.image }} style={item.key === 7 ? {width:'0%',height:'0%'} : styles.image} resizeMode="cover" />

          </View>
          
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
          
       
      </TouchableWithoutFeedback>
    );
  };

  return (
    
      <View style={styles.container}>
        <Text style={styles.headingStyles} >Custom Gallery</Text>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item,index) => item.key.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isLongPressed}
      />
      
      
        <TouchableWithoutFeedback onPress={removeImage}>
        <View style={styles.bottomContainer}>
          {isInBottomContainer && (
            <Image source={{ uri: draggedImage.image }} style={styles.bottomImage} resizeMode="cover" /> )}
          </View>
        </TouchableWithoutFeedback>
     
      </View>
  
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 40,
    marginBottom: 20,
    alignItems:'center',
    justifyContent:'center'
    
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    
    position: 'absolute',
    top: SCREEN_HEIGHT*0.5,
    left: IMAGE_WIDTH/2,
    width: SCREEN_WIDTH - 100,
    zIndex: 200,
    height: SCREEN_HEIGHT/3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    
    borderColor:'gray',
    borderWidth: 2
    
  },
  bottomImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  headingStyles: {
    color: 'black',
    fontSize: 32,
    marginBottom: 20,
}
});

export default App;





