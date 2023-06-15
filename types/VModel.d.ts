// import * as vueDemi from 'vue-demi'
// import { Ref, InjectionKey, ComputedRef, ComponentPublicInstance, UnwrapRef, ToRefs } from 'vue-demi'

// interface VModelOptions {
//   /**
//    * When passive is set to `true`, it will use `watch` to sync with props and ref.
//    * Instead of relying on the `v-model` or `.sync` to work.
//    *
//    * @default false
//    */
//   passive?: boolean;
//   /**
//    * When eventName is set, it's value will be used to overwrite the emit event name.
//    *
//    * @default undefined
//    */
//   eventName?: string;
//   /**
//    * Attempting to check for changes of properties in a deeply nested object or array.
//    *
//    * @default false
//    */
//   deep?: boolean;
// }

// /**
//  * Shorthand for v-model binding, props + emit -> ref
//  *
//  * @see https://vueuse.org/useVModel
//  * @param props
//  * @param key (default 'value' in Vue 2 and 'modelValue' in Vue 3)
//  * @param emit
//  */
// declare function useVModel<P extends object, K extends keyof P, Name extends string>(
//   props: P, key?: K, emit?: (name: Name, ...args: any[]) => void, options?: VModelOptions
// )
// : vueDemi.Ref<UnwrapRef<P[K]>> | vueDemi.WritableComputedRef<P[K]>
