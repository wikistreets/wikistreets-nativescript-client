<script>
  const doLogin = () => {
    console.log("Login button clicked");
  };
</script>

<page>
  <actionBar title="Log In" />
  <stackLayout orientation="vertical">
    <textField
      hint="Email"
      keyboardType="email"
      autocorrect="false"
      autocapitalizationType="none"
    />
    <textField hint="Password" secure="true" />
    <button text="Log In" on:click={doLogin} />
  </stackLayout>
</page>
