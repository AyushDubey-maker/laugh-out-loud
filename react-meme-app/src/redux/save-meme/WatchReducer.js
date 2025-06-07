// eslint-disable-next-line
export default (state, action) => {
    switch (action.type) {
      case "ADD_MEME_TO_SAVELIST":
        return {
          ...state,
          savelist: [action.payload, ...state.savelist],
        };
      case "REMOVE_MEME_FROM_SAVELIST":
        return {
          ...state,
          savelist: state.savelist.filter(
            (meme) => meme.id !== action.payload
          ),
        };
     
      default:
        return state;
    }
    
  };