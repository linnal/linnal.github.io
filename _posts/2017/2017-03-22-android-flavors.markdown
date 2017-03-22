---
layout: post
title: How to use Android Product Flavors
date: '2017-03-22 23:11'
image: assets/images/android_icon.png
---

<p> The idea came to me when I saw this
<a class="pink_link" href="https://www.youtube.com/watch?v=vdasFFfXKOY">video</a> on Android Testing.
Suppose you want to create a fully mocked version of your application, despite the one you are doing
for production.
</p>
<!--more-->
This is where productFlavors come in. Open your **app/build.gradle** file and insert the following:


~~~ java
android {
    ...

    productFlavors {
        mock {
            applicationIdSuffix ".mock"
            versionNameSuffix "-mock"
        }
        prod {
            applicationIdSuffix ".prod"
            versionNameSuffix "-prod"
        }
    }
}
~~~

We are creating two different flavors **mock** and **prod**, once you sync your gradle file
you will see the following in your **Build Variants**

![Build Variants](/assets/images/android/build_variable.png)

<br />
<br />
<br />

<h3 class="post-title"> Now, let's try to use them! </h3>

I have created a simple code, just to give an idea how things will look like.
We have a field were we write a name, and give this name to an API that will give you back a list of
emails that matches the name you inserted. So the structure of your code looks like the following:

<div class="statement">
    <p>
      app/src
      <br />
      └── main
      <br /> &nbsp; &nbsp; &nbsp;
          ├── AndroidManifest.xml
      <br /> &nbsp; &nbsp; &nbsp;
          └── java
      <br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;    
              └── it.linnal.androidflavor
      <br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  ├── EmailApi.java
      <br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  └── MainActivity.java
    </p>
  </div>
  <div class="flex-column">
    <p> What <strong>EmailApi</strong> class does, is a POST request to a give URL (the url you'll use in production).
    <br/>
    Now that we introduced the concept of <strong>productFlavor</strong>, let's make the modifications to use them.</p>
  </div>
  <br/>

  <p>Create <strong>mock</strong> and <strong>prod</strong> folders under <strong>src</strong> </p>  
  <div class="statement ">
    <p>
      app/src
      <br />
      ├── main
      <br />
      ├── mock
      <br />
      └── prod
    </p>
  </div>
  <br/>

  <p>Now copy the class EmailApi.java inside both of them and remove it from <strong>main</strong>. Things will still work as before. </p>
  <div class="statement">
    <p>
      app/src
      <br />
      └── main
      <br />
      │   &nbsp; &nbsp; &nbsp;├── AndroidManifest.xml
          <br />
      │   &nbsp; &nbsp; &nbsp;└── java
      <br/>
      │    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;   └── it.linnal.androidflavor
      <br />

      │ &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; └── MainActivity.java
      <br />
      ├── mock
      <br />
      │  &nbsp; &nbsp; &nbsp; └── java
      <br />
      │    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;   └── it.linnal.androidflavor
      <br />
      │    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;       └── EmailApi.java
      <br />
      └── prod
      <br />
          &nbsp; &nbsp; &nbsp;└── java
      <br />
              &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;└── it.linnal.androidflavor
      <br />
          &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;        └── EmailApi.java
    </p>
  </div>

  <br/>
Now you can modify EmailApi.java under **mock** to return an hardcoded result. For example, return always
the same email for whatever input you insert, so you do not need to call the real API anymore.

<br/>
<div class="statement">
  <p>
  Depending on which environment you want your app to run, choose it under <strong>Build Variants</strong>.
  <br />
  * If you choose <strong>mock</strong> you will see that whatever you insert you will get back the same email.
  <br />
  * If you choose <strong>prod</strong> you will be calling the API.
  </p>
</div>
