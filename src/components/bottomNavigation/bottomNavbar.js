import { View, Pressable } from "react-native";
import TabIcon from "./Tableicon";
import styles from "./styles";

export default function BottomNavigation({ activeTab, onTabChange }) {
  const navItems = [
    { id: 1, icon: "home" },
    { id: 2, icon: "stats" },
    { id: 3, icon: "trophy" },
    { id: 4, icon: "albums" },
    { id: 5, icon: "wallet" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {navItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onTabChange(item.icon)}
            style={styles.tabWrapper}
          >
            <View
              style={[
                styles.iconContainer,
                activeTab === item.icon && styles.activeIconContainer
              ]}
            >
              <TabIcon
                name={item.icon}
                active={activeTab === item.icon}
                id={item.icon}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
