import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

interface Product {
    id: number,
    name: string,
    price: number
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<Product[]>([])

    const total = computed(() => {
        items.value.reduce((acc, item) => acc + item.price, 0)
    })

    function addToCart(product: Product) {
        items.value.push(product)
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter(item => item.id !== productId)
    }

    return {items, total, addToCart, removeFromCart}
})