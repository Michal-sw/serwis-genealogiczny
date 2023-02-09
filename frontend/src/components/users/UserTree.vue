<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { getUserTreeById } from '../../services/axiosService';
import { useNotificationStore } from '../../stores/notifications';
import TreeMember from './TreeMember.vue';

const props = defineProps({
    id: String
});

const parentMap = ref({});
const rootUser = ref({});
const rerender = ref(0);

onBeforeMount(() => {
    getUserTreeById(props.id)
        .then(res => {
            rootUser.value = res.data.find(v => v.id === "8");

            parentMap.value = res.data.reduce((prev, curr) => {
                return {
                    ...prev,
                    [curr.id]: curr.parents
                }
            }, {});

            rerender.value += 1;
        })
        .catch(_err => useNotificationStore().addError("Could not get user tree!"))
})


</script>

<template>
    <h2>User tree</h2>
    <div id="wrapper">
        <TreeMember
            :key="rootUser.id"
            v-bind="rootUser"
            :parentMap="parentMap"
            :branchLevel="1"
        />
    </div>
</template>

<!-- 
<div id="wrapper">
  <span class="label">Root</span>

  <div class="branch lv1">

    <div class="entry">
      <span class="label">Entry-1</span>
      <div class="branch lv2">
        <div class="entry">
          <span class="label">Entry-1-1</span>
          <div class="branch lv3">
            <div class="entry"><span class="label">Entry-1-1-1</span></div>
            <div class="entry"><span class="label">Entry-1-1-2</span></div>
            <div class="entry"><span class="label">Entry-1-1-3</span></div>
          </div>
        </div>
        <div class="entry">
          <span class="label">Entry-1-2</span>
          <div class="branch lv3">
            <div class="entry sole"><span class="label">Entry-1-2-1</span></div>
          </div>
        </div>
        <div class="entry"><span class="label">Entry-1-3</span>
          <div class="branch lv3">
            <div class="entry sole"><span class="label">Entry-1-3-1</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="entry">
      <span class="label">Entry-2</span>
    </div>

    <div class="entry">
      <span class="label">Entry-3</span>
      <div class="branch lv2">
        <div class="entry"><span class="label">Entry-3-1</span></div>
        <div class="entry"><span class="label">Entry-3-2</span></div>
        <div class="entry"><span class="label">Entry-3-3</span>
          <div class="branch lv3">
            <div class="entry"><span class="label">Entry-3-3-1</span></div>
            <div class="entry"><span class="label">Entry-3-3-2</span>
              <div class="branch lv4">
                <div class="entry"><span class="label">Entry-3-3-2-1</span></div>
                <div class="entry"><span class="label">Entry-3-3-2-2</span></div>
              </div>
            </div>
            <div class="entry"><span class="label">Entry-3-3-3</span></div>
          </div>
        </div>
        <div class="entry"><span class="label">Entry-3-4</span></div>
      </div>
    </div>

    <div class="entry"><span class="label">Entry-4</span></div>
    <div class="entry"><span class="label">Entry-5</span></div>
    <div class="entry"><span class="label">Entry-6</span></div>
  </div>
</div>

<a href="https://stackoverflow.com/a/31161783/762640">Source 1</a>
<a href="https://codepen.io/anon/pen/OVQXGg">Source 2</a>
 -->

<style lang="scss" scoped>

//------- {{ Variables }} -------//

$white: #eee9dc;
$bg: #2e6ba7;

$horizontal-gutter: 100px;
$border-radius: 10px;

$entry-min-height: 60px;

$label-width: 150px;
$label-height: 30px;
$label-border-radius: 5px;


//------- {{ Styles }} -------//

*, *:before, *:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  min-width: 1200px;
  margin: 0;
  padding: 50px;
  color: $white;
  font: 16px Verdana, sans-serif;
  background: $bg;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#wrapper {
  position: relative;
}

.branch {
  position: relative;
  margin-right: $horizontal-gutter + $label-width;
  &:before {
    content: "";
    width: calc($horizontal-gutter / 2);
    border-top: 2px solid $white;
    position: absolute;
    right: -$horizontal-gutter;
    top: 50%;
    margin-top: 1px;
  }
}

.entry {
  position: relative;
  min-height: $entry-min-height;
  &:before {
    content: "";
    height: 100%;
    border-right: 2px solid $white;
    position: absolute;
    right: -(calc($horizontal-gutter / 2));
  }
  &:after {
    content: "";
    width: calc($horizontal-gutter / 2);
    border-top: 2px solid $white;
    position: absolute;
    right: -(calc($horizontal-gutter / 2));
    top: 50%;
    margin-top: 1px;
  }
  &:first-child {
    &:before {
      width: $border-radius;
      height: 50%;
      top: 50%;
      margin-top: 2px;
      border-radius: 0 $border-radius 0 0;
    }
    &:after {
      height: $border-radius;
      border-radius: 0 $border-radius 0 0;
    }
  }
  &:last-child {
    &:before {
      width: $border-radius;
      height: 50%;
      border-radius: 0 0 $border-radius 0;
    }
    &:after {
      height: $border-radius;
      border-top: none;
      border-bottom: 2px solid $white;
      border-radius: 0 0 $border-radius 0;
      margin-top: -$border-radius + 1px;
    }
  }
  &.sole {
    &:before {
      display: none;
    }
    &:after {
      width: calc($horizontal-gutter / 2);
      height: 0;
      margin-top: 1px;
      border-radius: 0;
    }
  }
}

.label {
  display: block;
  min-width: $label-width;
  padding: 5px 10px;
  line-height: $label-height - 5px * 2;
  text-align: center;
  border: 2px solid $white;
  border-radius: $label-border-radius;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -(calc($label-height / 2));
}

</style>
