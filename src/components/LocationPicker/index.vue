<template>
  <van-popup
    v-model:show="innerShow"
    position="bottom"
    round
    :style="{ height: '60vh' }"
  >
    <div class="location-picker">
      <div class="header">
        <van-button size="small" type="default" @click="handleCancel">取消</van-button>
        <span class="title">选择钓点</span>
        <van-button size="small" type="primary" :disabled="!selected" @click="handleConfirm">确定</van-button>
      </div>

      <div class="search-bar">
        <van-search
          v-model="keyword"
          placeholder="搜索钓点"
          shape="round"
          background="#f7f8fa"
        />
      </div>

      <div class="location-list">
        <van-cell
          v-for="location in filteredLocations"
          :key="location.id"
          :title="location.name"
          :label="location.address"
          :class="{ active: selected?.id === location.id }"
          @click="selectLocation(location)"
        >
          <template #icon>
            <van-icon name="location-o" size="18" />
          </template>
        </van-cell>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Location {
  id: string
  name: string
  address: string
}

const props = defineProps<{
  show: boolean
  modelValue: Location | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'update:modelValue': [value: Location | null]
}>()

const innerShow = ref(props.show)
const selected = ref<Location | null>(props.modelValue)
const keyword = ref('')

const mockLocations: Location[] = [
  { id: '1', name: 'XX水库', address: '北京市XX区XX水库' },
  { id: '2', name: 'XX河段', address: '上海市XX区XX河' },
  { id: '3', name: 'XX公园湖', address: '广州市XX区XX公园' },
  { id: '4', name: 'XX水库', address: '深圳市XX区XX水库' },
  { id: '5', name: 'XX江段', address: '杭州市XX区XX江' }
]

const filteredLocations = computed(() => {
  if (!keyword.value) return mockLocations
  return mockLocations.filter(
    loc => loc.name.includes(keyword.value) || loc.address.includes(keyword.value)
  )
})

const selectLocation = (location: Location) => {
  selected.value = location
}

const handleConfirm = () => {
  emit('update:modelValue', selected.value)
  innerShow.value = false
}

const handleCancel = () => {
  innerShow.value = false
}

watch(innerShow, (val) => {
  emit('update:show', val)
})

watch(() => props.show, (val) => {
  innerShow.value = val
})
</script>

<style lang="scss" scoped>
.location-picker {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 16px;
    font-weight: 500;
  }
}

.search-bar {
  padding: 12px 16px;
}

.location-list {
  flex: 1;
  overflow-y: auto;
}

.van-cell {
  &.active {
    background: #e6f7ff;
  }
}
</style>
