import { ActionReducerMap } from "@ngrx/store";
import { LayoutState, layoutReducer } from "./layouts/layout-reducers";
// import { authenticationReducer, AuthenticationState } from "./Authentication/authentication.reducer";

export interface RootReducerState {
    layout: LayoutState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,

}