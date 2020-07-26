import Service from './service';
import getWeb3 from '../helper/getWeb3';
import config from '../config';

$(document).ready(async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');
  const web3 = await getWeb3();

  $('#loginForm').submit(async (e) => {
    e.preventDefault();
    hideMessages();

    try {
      const data = await Service.login({
        username: $("input[name='username']").val(),
        password: $("input[name='password']").val(),
      });

      if (data) {
        window.location.replace('/passport-control');
      }
    } catch (e) {
      $('#msg').html(e.message);
      $('#msg').show();
    }
  });

  $('#frmForgotPass').submit(async (e) => {
    e.preventDefault();
    hideMessages();

    try {
      const data = await Service.forgetPassword({
        email: $('#forgot_email').val(),
      });

      $('#info').html('Please check your email for further instructions.');
      $('#info').show();
      $('#forgotPassModal').modal('hide');
    } catch (e) {
      $('#info').html('Please check your email for further instructions.');
      $('#info').show();
      $('#forgotPassModal').modal('hide');
    }
  });

  $('#metamaskLogin').on('click', async () => {
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }

    const eth_address = await web3.eth.getCoinbase();
    if (!eth_address) {
      window.alert('Please activate MetaMask first.');
      return;
    }
    try {
      const { nonce } = await Service.getNonce({ eth_address });
      const signature = await web3.eth.personal.sign(config.signMsg + nonce, eth_address);
      const data = await Service.metamaskLogin({
        signature,
        eth_address,
      });

      if (data) {
        window.location.replace('/passport-control');
      }
    } catch (e) {
      $('#msg').html(e.message);
      $('#msg').show();
    }
  });
});

const hideMessages = () => {
  $('#msg').hide();
  $('#info').hide();
};
