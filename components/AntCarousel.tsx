import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Image, Dimensions, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components';

const Container = styled(View)`
  flex: 1;
  margin-vertical: 16px;
`;


const AntImage = styled(Image)`
  width: 100px;
  height: 100px;
`;

const StyledCarousel = styled(Carousel)`
  flex: 1;
`;

const AntContainer = styled(View)`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px;
`;

const AntColor = styled(View)`
  background-color: ${p => p.antColor ? p.antColor : '#ffffff'}
`;

const AntTitle = styled(Text)``;

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.30);

const renderItem = (({ item: ant, index }) => {
  const color = ant?.color.toLowerCase()
  return (
    <AntContainer key={index}>
      <AntColor antColor={color}>
        <AntImage source={require('../assets/ant.jpg')}/>
      </AntColor>
      <AntTitle numberOfLines={1}>{ant?.name}</AntTitle>
    </AntContainer>
  )
})

const AntCarousel = ({ ants }) => {
  const carouselRef = useRef(null);
  return (
    <Container>
      <StyledCarousel
        ref={carouselRef}
        data={ants}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH} 
        inactiveSlideOpacity={1}
        scrollEnabled={false}
        layout={'default'}
        inverted
        enableSnap
        autoplay
        autoplayInterval={2200}
        loopClonesPerSide={4}
        loop
      />
    </Container>
  );
}

export default AntCarousel;