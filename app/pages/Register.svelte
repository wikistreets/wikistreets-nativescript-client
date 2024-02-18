<!-- @component Register form for new users. -->

<script lang="ts">
  let email: string = ''
  let username: string = ''
  let password: string = ''
  const handleFormSubmit = () => {
    console.log(
      `Form submit with email='${email}', username='${username}', password='${password}'`,
    )
  }
</script>

<page>
  <actionBar title="Register" />
  <stackLayout orientation="vertical">
    <textField
      hint="Email"
      keyboardType="email"
      autocorrect="false"
      autocapitalizationType="none"
    />
    <textField
      hint="Username"
      keyboardType="text"
      autocorrect="false"
      autocapitalizationType="none"
    />
    <textField hint="Password" secure="true" />
    <button text="Register" on:tap={handleFormSubmit} />
  </stackLayout>
</page>
