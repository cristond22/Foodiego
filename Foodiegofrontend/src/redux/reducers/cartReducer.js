const initialState = {
    items: []
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_ITEM_TO_CART":
            const { foodId, quantity, name, price, image } = action.payload;

            // Check if the item is already in the cart
            const existingItemIndex = state.items.findIndex(item => item.foodId._id === foodId._id);

            if (existingItemIndex !== -1) {
                // If item exists, update its quantity
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += quantity;
                return { ...state, items: updatedItems };
            } else {
                // If item doesn't exist, add it to the cart
                return {
                    ...state,
                    items: [
                        ...state.items,
                        { foodId, quantity, name, price, image }
                    ]
                };
            }
            case 'UPDATE_ITEM_QUANTITY':
    return {
        ...state,
        items: state.items.map(item => {
            const itemId = item.foodId?._id || item.foodId || item._id;

            if (itemId === action.payload.itemId) {
                return { ...item, quantity: action.payload.quantity };
            }
            return item;
        }),
    };

            case "REMOVE_ITEM":
                const itemToRemove = state.items.find(item => item.foodId._id === action.payload);
                
                if (itemToRemove && itemToRemove.quantity > 1) {
                    // Decrease quantity by 1 if greater than 1
                    const updatedItems = state.items.map(item => 
                        item.foodId._id === action.payload
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                    return { ...state, items: updatedItems };
                } else {
                    // Remove item entirely if quantity is 1 or less
                    return {
                        ...state,
                        items: state.items.filter(item => item.foodId._id !== action.payload)
                    };
                }
    

        default:
            return state;
    }
};

export default cartReducer;
