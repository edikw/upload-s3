<!-- Please remove this file from your project -->
<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div id="app">
      <file-pond
        name="test"
        ref="pond"
        label-idle="Drop files here..."
        accepted-file-types="image/jpeg, image/png"
        v-bind:files="file"
      />
    </div>
    <button @click.prevent="upload()">Upload</button>
    <div v-if="image">
      <img
        :src="image"
        alt=""
        style="width: 500x; height: 500px"
      >
    </div>
  </div>
</template>

<script>
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import axiosUpload from "@/plugins/axios";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
export default {
  name: "NuxtTutorial",
  components: {
    FilePond,
  },
  data() {
    return {
      file: "",
      image: "",
    };
  },

  methods: {
    async upload() {
      const file = this.$refs.pond.getFiles()[0].file;
      const formData = new FormData();
      formData.append("file", file, file.name);
      const res = await axiosUpload.post("/v1/upload", formData);
      if (res.data.status) {
        this.image = res.data.data;
      }
    },
  },
};
</script>
