import Accounts, { AccountRole, hashBcrypt } from 'libs/schemas/account.schema';
import { read, readAndChoose } from '@drstrain/drutil';

async function createAdminAccount() {
  const username = await read('Username:');
  const password = await read('Password:');
  try {
    await Accounts.create({ username, password, role: AccountRole.ADMIN });
    console.log('Successfully created admin account');
  } catch (err) {
    console.log('Error detected');
    console.log(err);
  }
}

async function resetAccountPassword() {
  const accs = await Accounts.find();
  const prompts = accs.map(
    (acc) => `Username: ${acc.username}, role: ${acc.role}`,
  );
  const res = await readAndChoose(
    'Please choose account to reset password',
    prompts,
  );
  const index = prompts.indexOf(res);
  if (index !== -1) {
    const newPassword = await read('New password:');
    const hashed = await hashBcrypt(newPassword);
    await Accounts.updateOne(
      { username: accs[index].username },
      { $set: { password: hashed } },
    );
    console.log('Successfully update password');
  }
}

export async function handleAccounts() {
  const actions = ['Create admin account', 'Reset account password'];
  const res = await readAndChoose('Please choose action', actions);
  switch (res) {
    case actions[0]:
      return createAdminAccount();
    case actions[1]:
      return resetAccountPassword();
  }
}
