<template>
  <div id="app">
    <form v-on:submit.prevent>
      <div>
        <label>Name: </label>
        <input v-model="form.name" class="input" />
      </div>
      <div>
        <label>Description: </label>
        <input v-model="form.description" class="input" />
      </div>
      <div>
        <label>City: </label>
        <input v-model="form.city" class="input" />
      </div>
      <button @click="createRestaurant" class="button">Create</button>
    </form>
    <!-- <amplify-authenticator> -->
    <div v-for="restaurant of restaurants" :key="restaurant.id">
      {{ restaurant.name }}
    </div>
    <!-- </amplify-authenticator> -->
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import { listRestaurants, posts } from "./graphql/queries";
import { createRestaurant } from "./graphql/mutations";

import { Predictions } from "@aws-amplify/predictions";
export default {
  name: "App",
  data() {
    return {
      user: {},
      restaurants: [],
      form: {},
      clientId: null,
    };
  },
  async created() {
    this.currentUser();
    let response = await API.graphql(
      graphqlOperation(listRestaurants, { limit: 2 })
    );
    console.log("1", response.data.listRestaurants);
    response = await API.graphql({
      query: posts,
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    console.log("2", response.data);

    this.restaurants = response.data.listRestaurants.items;
    this.clientId = "12d1ff7";

    Predictions.convert({
      translateText: {
        source: {
          text: "My taylor is rich!",
          language: "en",
        },
        targetLanguage: "vi",
      },
    }).then(({ text }) => {
      console.log("Predictions", text);
    });

    // Predictions.convert({
    //   textToSpeech: {
    //     source: {
    //       text: "hello",
    //     },
    //     voiceId: "Brian",
    //   },
    // }).then((result) => {
    //   console.log(result)
    //   if (result.speech.url) {
    //     this.audio = new Audio();
    //     this.audio.src = result.speech.url;
    //     this.audio.play();
    //   }
    // });
  },
  methods: {
    currentUser() {
      Auth.currentAuthenticatedUser().then((user) => {
        this.user = user;
      });
    },
    async createRestaurant() {
      try {
        const { name, description, city } = this.form;
        const restaurant = { name, description, city, clientId: this.clientId };
        const response = await API.graphql(
          graphqlOperation(createRestaurant, { input: restaurant })
        );
        this.restaurants = [
          ...this.restaurants,
          response.data.createRestaurant,
        ];
        this.form = { name: "", description: "", city: "" };
        console.log("item created!");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
