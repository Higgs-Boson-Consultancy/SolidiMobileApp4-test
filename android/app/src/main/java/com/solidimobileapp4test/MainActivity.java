package com.solidimobileapp4test;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SolidiMobileApp4";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      //SplashScreen.show(this);
      //super.onCreate(savedInstanceState);
      androidx.core.splashscreen.SplashScreen.installSplashScreen(this); // native splash screen which will be skipped
      org.devio.rn.splashscreen.SplashScreen.show(this, true); // custom splash screen from react-native-splash-screen library
      super.onCreate(null);
  }

}
