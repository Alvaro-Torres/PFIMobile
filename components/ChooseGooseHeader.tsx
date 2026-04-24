import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from "react-native";

type Props = {
  quote: string;
  language: "en" | "fr";
  onLanguageChange: () => void;
  onChooseGoosePress?: () => void;
};

export default function ChooseGooseHeader({
  quote,
  language,
  onLanguageChange,
  onChooseGoosePress
}: Props) {

const { width } = useWindowDimensions();
const isMobile = width < 700;

return (
<>
<Pressable
style={styles.languageButton}
onPress={onLanguageChange}
>
<Text style={styles.languageButtonText}>
{language==="en" ? "FR" : "EN"}
</Text>
</Pressable>

<View style={[
styles.header,
isMobile && styles.headerMobile
]}>

<Image
source={require("../assets/images/shopping_time.png")}
style={[
styles.titleImage,
isMobile && styles.titleImageMobile
]}
resizeMode="contain"
/>

<View style={[
styles.speechBubble,
isMobile && styles.speechBubbleMobile
]}>
<Text style={styles.speechText}>
{quote}
</Text>
</View>

<Pressable
onPress={onChooseGoosePress}
style={({hovered,pressed})=>[
styles.gooseBubble,
isMobile && styles.gooseBubbleMobile,
hovered && styles.bubbleHover,
pressed && styles.bubblePressed
]}
>

<Image
source={require("../assets/images/bubble.png")}
style={styles.gooseBubbleImage}
/>

<Image
source={require("../assets/images/choose_goose.png")}
style={styles.gooseImage}
resizeMode="contain"
/>

</Pressable>

</View>
</>
);

}

const styles = StyleSheet.create({

languageButton:{
position:"absolute",
top:15,
right:15,
zIndex:10,
backgroundColor:"white",
borderWidth:2,
borderColor:"black",
borderRadius:20,
paddingVertical:6,
paddingHorizontal:12,
},

languageButtonText:{
fontSize:14,
fontWeight:"900",
},

header:{
height:230,
position:"relative",
},

headerMobile:{
height:390,
alignItems:"center",
},

titleImage:{
position:"absolute",
top:10,
left:25,
width:250,
height:130,
},

titleImageMobile:{
position:"relative",
top:25,
left:0,
width:260,
height:120,
},

speechBubble:{
position:"absolute",
top:38,
right:145,
width:360,
minHeight:95,
backgroundColor:"white",
borderWidth:3,
borderColor:"black",
borderRadius:35,
paddingVertical:14,
paddingHorizontal:18,
justifyContent:"center",
},

speechBubbleMobile:{
position:"relative",
top:15,
right:0,
width:"85%",
minHeight:85,
},

speechText:{
fontSize:15,
fontWeight:"800",
textAlign:"center",
},

gooseBubble:{
position:"absolute",
top:25,
right:25,

width:125,
height:125,
borderRadius:70,

backgroundColor:"rgba(255,255,255,0.35)",
borderWidth:3,
borderColor:"rgba(255,190,255,0.9)",

alignItems:"center",
justifyContent:"center",
overflow:"hidden",
},

gooseBubbleMobile:{
position:"relative",
top:35,
right:0,
},

gooseBubbleImage:{
position:"absolute",
width:135,
height:135,
opacity:0.75,
},

gooseImage:{
width:95,
height:95,
borderRadius:50,
},

bubbleHover:{
transform:[{scale:1.12}],
backgroundColor:"rgba(255,255,255,0.6)",
borderColor:"rgba(255,120,255,1)",
},

bubblePressed:{
transform:[{scale:0.95}],
}

});