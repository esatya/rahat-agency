import AgencyRegister from './register.panel';
import { key } from '../helper/key';

$(document).ready(() => {
  const agencyAdd = new AgencyRegister({
    target: '#agencyRegister',
  });
  $('#wizard').steps();
  $('#form')
    .steps({
      bodyTag: 'fieldset',
      onStepChanging(event, currentIndex, newIndex) {
        // Always allow going backward even if the current step contains invalid fields!
        if (currentIndex > newIndex) {
          return true;
        }

        // Forbid suppressing "Warning" step if the user is to young
        if (newIndex === 3 && Number($('#age').val()) < 18) {
          return false;
        }

        const form = $(this);

        // Clean up if user went backward before
        if (currentIndex < newIndex) {
          // To remove error styles
          $(`.body:eq(${newIndex}) label.error`, form).remove();
          $(`.body:eq(${newIndex}) .error`, form).removeClass('error');
        }

        // Disable validation on fields that are disabled or hidden.
        form.validate().settings.ignore = ':disabled,:hidden';

        // Start validation; Prevent going forward if false
        return form.valid();
      },
      onStepChanged(event, currentIndex, priorIndex) {
        // Suppress (skip) "Warning" step if the user is old enough.
        if (currentIndex === 2 && Number($('#age').val()) >= 18) {
          $(this).steps('next');
        }

        // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
        if (currentIndex === 2 && priorIndex === 3) {
          $(this).steps('previous');
        }
      },
      onFinishing(event, currentIndex) {
        const form = $(this);

        // Disable validation on fields that are disabled.
        // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
        form.validate().settings.ignore = ':disabled';

        // Start validation; Prevent form submission if false
        return form.valid();
      },
      async onFinished(event, currentIndex) {
        // Submit form input
        // form.submit();

        const data = await agencyAdd.addAgency();
      },
    })
    .validate({
      errorPlacement(error, element) {
        element.before(error);
      },
      rules: {
        confirm: {
          equalTo: '#password',
        },
      },
    });

  agencyAdd.on('agency-registered', (e, d) => {
    swal({
      title: 'Sucessfully Registered!',
      text: 'your registration is queued for approval',
      icon: 'success',
      button: 'OK!',
    });
  });

  $('#btnGenerateAddress').on('click', async () => {
    const { mnemonic, addr, pk } = await key();
    $('#ethAddress').val(addr);
    $('#seedPhrase').html(`Seed Phrase : <small>${mnemonic}</small>`);
    $('#address').html(`Address: <small>${addr}</small>`);
    $('#privateKey').html(`Private Key: <small>${pk}</small>`);
  });
});
