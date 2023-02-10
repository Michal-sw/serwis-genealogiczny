<script setup>
import { ref, computed } from 'vue';
import { useTreeStore } from '../../stores/tree';
import { RouterLink } from 'vue-router';
import { deleteMember } from '../../services/axiosService';
import router from '../../router';
import { useNotificationStore } from '../../stores/notifications';

const props = defineProps({
    id: String,
    props: {
        birthDate: Object,
        name: String
    },
    branchLevel: Number
});

const parents = computed(() => {
    return useTreeStore().parentMap[props.id];
})

const isRoot = computed(() => {
  return props.id === useTreeStore().realRootMember?.id
})

const isAddMenuVisible = ref(false);

const vChangeAddMenuVisibility = {
    mounted: (element) => {
        element.clickOutsideEvent = (event) => {
            isAddMenuVisible.value = element == event.target || element.contains(event.target) ? true : false;
        };
        document.body.addEventListener('click', element.clickOutsideEvent)
    },
    unmounted: (element) => {
        document.body.removeEventListener('click', element.clickOutsideEvent)
    }
};

function setAsRoot() {
    useTreeStore().changeRoot({
        id: props.id,
        parents: props.parents,
        props: props.props,
    });
}

function onDelete() {
    const isSure = confirm("Are you sure?");
    const isRoot = props.id === useTreeStore().realRootMember?.id
    if (!isSure || isRoot) return;
    deleteMember(useTreeStore().treeOwnerId, props.id)
      .then(_res => router.go(0))
      .catch(_err => useNotificationStore().addError("Can not delete node!"));
}

</script>

<template>
    <span
        v-changeAddMenuVisibility
        class="tree-member label"
    >
        {{ props?.props?.name }}
        <div
            v-if="isAddMenuVisible" 
            class="add-menu-container"
        >
            <button @click="setAsRoot">Set as root</button>
            <RouterLink
                :to="{ name: 'addTreeMember', params: { id: props.id },  }"
            >
                <button class="green">Add relation</button>
            </RouterLink>
            <button v-if="!isRoot" class="danger" @click="onDelete">Delete node</button>
        </div>
    </span>

    <div
        v-bind:class="`branch lv${props.branchLevel}`"
    >
        <div
            v-bind:key="parent.id"
            v-for="parent in parents"
            :class="parents.length > 1 ? 'entry' : 'entry sole'"
        >
            <TreeMember
                :key="parent.id"
                :id="parent.id"
                :props="{name: parent.props.name, birthDate: parent.props.birthdate}"
                :branchLevel="props.branchLevel+1"
            />
        </div>
    </div>

</template>

<style scoped lang="scss">
    .add-menu-container {
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        z-index: 5;
    }


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