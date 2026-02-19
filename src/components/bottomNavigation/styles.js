import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    width: "90%",
    maxWidth: 390,
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    backgroundColor: "#202020",
    borderRadius: 999,
    padding: 2
  },

  tabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },

  activeIconContainer: {
    backgroundColor: "#fbfbfb",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 100,
  },
});
