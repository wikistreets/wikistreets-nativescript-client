<script lang="ts">
  let email: String = ''
  let password: String = ''
  const handleFormSubmit = () => {
    console.log(`Form submit with email='${email}', password='${password}'`)
  }
</script>

<page>
  <actionBar title="Log In" />
  <stackLayout orientation="vertical">
    <textField
      hint="Email"
      keyboardType="email"
      autocorrect="false"
      autocapitalizationType="none"
      text={email}
    />
    <textField hint="Password" secure="true" text={password} />
    <button text="Log In" on:tap={handleFormSubmit} />
  </stackLayout>
</page>
